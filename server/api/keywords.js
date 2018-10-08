const router = require('express').Router();
let descriptions = require('../../descriptions');
const Tag = require('../db/models/tag');
const ChannelTag = require('../db/models/channelTag');
const sw = require('stopword');

var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

console.log('length of des', descriptions.length);

router.get('/', async (req, res, next) => {
	try {
		let channelId = req.query.channelId;
		console.log('CHANNELID', channelId);
		console.log('QUERY', req.query);
		let input = req.query.input;
		let inputArr = sw.removeStopwords(
			input
				.split(/([_\W])/)
				.filter(
					(word) =>
						word !== ' ' && word !== '.' && word !== ',' && word !== '!' && word !== '?' && word !== ''
				)
				.map((word) => word.toLowerCase())
		);

		let descriptionsArr = descriptions.slice(0, 500);
		descriptionsArr.forEach((each) => {
			tfidf.addDocument(each);
		});

		//let inputArr = input.split(' ')
		inputArr.forEach(async (each) => {
			let allDes = 0;
			let currentTag;

			tfidf.tfidfs(each, function(i, measure) {
				currentTag = each;
				allDes += measure;
			});
			let tagRating = allDes / descriptionsArr.length;
			let tagId;
			if (tagRating > 0.1) {
				let tag = await Tag.findOrCreate({
					where: {
						name: currentTag.toLowerCase()
					}
				});
				tagId = await tag[0].id;
				console.log('TAG.ID', tagId);
				let previousTag = await ChannelTag.findById(tagId);
				if (!previousTag) {
					await ChannelTag.create({
						channelId: channelId,
						tagId: tagId,
						score: 0.5
					});
				}
			}
		});

		res.send('THIS WORKS!!');
	} catch (err) {
		next(err);
	}
});
module.exports = router;
