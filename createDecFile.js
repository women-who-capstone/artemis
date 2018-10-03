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
		// if (descriptions.length < 10) {
		descriptions.push(data['Description']);
		// } else {
		// 	return;
		// }
	})
	.on('end', function() {
		var file = fs.createWriteStream('descriptions.js');
		file.on('error', function(err) {
			console.log('error handle', err.message);
		});
		const arrDescriptions = JSON.stringify(descriptions);
		file.write(arrDescriptions.toString());
		// descriptions.forstringify(v) {
		// 	file.write(v.toString() + '\n');
		// });

		file.on('finish', function() {
			console.log('finished');
		});
	});

// fs.writeFileSync(__dirname + 'descriptions.js', descriptions.toString());
