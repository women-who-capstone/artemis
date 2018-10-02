const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');
// const csvDescription = require('./podcasts.csv');
var csv = require('fast-csv');

router.get('/', async (req, res, next) => {
	let dataParsed = csv
		.fromPath('podcastsData.csv', { headers: [ 'Description' ] })
		.on('data', function(data) {
			console.log(data);
		})
		.on('end', function() {
			console.log('done');
		});
	try {
		let input = req.query.input;
		input = input.map((e) => JSON.parse(e));
		console.log('req', input);
		algorithmia.client(process.env.apiKey).algo(dataParsed).pipe(input).then(function(output) {
			if (output.error) {
				console.log(output.error);
				result = output.error;
			} else {
				console.log(output.get());
				result = output.get();
			}
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
