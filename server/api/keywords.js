const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');
var timeout = require('connect-timeout');
let descriptions = require('../../descriptions');
const Tag = require('../db/models/tag');

var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

console.log('length of des', descriptions.length);

router.get('/', async (req, res, next) => {
	try {
		// let input = req.query.input
		let input = [ 'the', 'History', 'technology' ];
		console.log('node--------------');
		let descriptionsArr = descriptions.slice(0, 10);
		descriptionsArr.forEach((each) => {
			tfidf.addDocument(each);
		});

		//let inputArr = input.split(' ')
		input.forEach((each) => {
			let allDes = 0;
			let currentTag;

			tfidf.tfidfs(each, function(i, measure) {
				currentTag = each;
				allDes += measure;
				console.log(`document# ${i} is ${measure}`);
			});
			let tagRating = allDes / descriptionsArr.length;
			if (tagRating > 0) {
				Tag.findOrCreate({
					where: {
						name: currentTag
					}
				});
			}
			console.log('tagRating', tagRating);
		});

		res.send('THIS WORKS!!');
	} catch (err) {
		next(err);
	}
});
module.exports = router;
