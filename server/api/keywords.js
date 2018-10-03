const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');
var timeout = require('connect-timeout');
let descriptions = require('../../descriptions');
//let sw = require('stopword');
const str = `skjdzlfna
azdlksf
alsdfj`

console.log('length of des', descriptions.length);
// const fs = require('fs');
// const csv = require('fast-csv');
// const path = require('path');

// var natural = require('natural');
// var TfIdf = natural.TfIdf;
// var tfidf = new TfIdf();

// var stream = fs.createReadStream(path.join(__dirname, 'podcasts.csv'));
// const headers = [ , , , , , , , , 'Description' ];

// let descriptions = [];

// csv
// 	.fromStream(stream, { headers: headers })
// 	.on('data', function(data) {
// 		// if (descriptions.length < 10) {
// 		descriptions.push(data['Description']);
// 		// } else {
// 		// 	return;
// 		// }
// 	})
// 	.on('end', function() {
// 		console.log('done');
// 	});
// fs.writeFile('./descriptions.js', descriptions, function() {
// 	console.log('write in file');
// });

router.get('/', async (req, res, next) => {
	try {
		// let input = req.query.input;
		//input = input.map(e => JSON.parse(e));
		//console.log('length', descriptions.length);
		//let input = descriptions.join(' ');
		// let old = inputeded.split(' ');
		// let newss = sw.removeStopwords(old);
		// let input = newss.join(' ');
		//	console.log('this is input', input);
		//	tfidf.addDocument(input);
		console.log('node--------------');
		// tfidf.tfidfs('health', function(i, measure) {
		// 	console.log('document # ' + i + ' is ' + measure);
		// });

		// tfidf.listTerms(0 /*document index*/).forEach(function(item) {
		// 	console.log(item.term + ': ' + item.tfidf);
		// });

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
		res.send('THIS WORKS!!');
	} catch (err) {
		next(err);
	}
});
module.exports = router;
