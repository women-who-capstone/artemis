const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');
var timeout = require('connect-timeout');

const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

var natural = require('natural');
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

var stream = fs.createReadStream(path.join(__dirname, 'podcasts.csv'));
const headers = [ , , , , , , , , 'Description' ];

let descriptions = [];
csv
	.fromStream(stream, { headers: headers })
	.on('data', function(data) {
		if (descriptions.length < 10) {
			descriptions.push(data['Description']);
		} else {
			return;
		}
	})
	.on('end', function() {
		console.log('done');
	});

router.get('/', timeout(1000000), async (req, res, next) => {
	try {
		// let input = req.query.input;
		//input = input.map(e => JSON.parse(e));

		let input = descriptions.join(' ');
		console.log('this is input', input);
		tfidf.addDocument(input);
		console.log('node--------------');
		// tfidf.tfidfs('health', function(i, measure) {
		// 	console.log('document # ' + i + ' is ' + measure);
		// });
		tfidf.listTerms(0 /*document index*/).forEach(function(item) {
			console.log(item.term + ': ' + item.tfidf);
		});

		// algorithmia
		// 	.client(process.env.apiKey)
		// 	.algo('nlp/KeywordsForDocumentSet/0.1.7')
		// 	.pipe(input)
		// 	.then(function(output) {
		// 		if (output.error) {
		// 			console.log(output.error);
		// 			result = output.error;
		// 		} else {
		// 			console.log(output.get());
		// 			result = output.get();
		// 		}
		// 	});
		// res.send(result);
	} catch (err) {
		next(err);
	}
});
module.exports = router;
