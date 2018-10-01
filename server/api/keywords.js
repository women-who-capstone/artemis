const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');

router.get('/', async (req, res, next) => {
	try {
		let input = req.query.input;
		input = input.map((e) => JSON.parse(e));
		console.log('req', input);
		algorithmia
			.client('simnhp22YPfc8yIG9tLnwcbOj+J1')
			.algo('nlp/KeywordsForDocumentSet/0.1.7')
			.pipe(input)
			.then(function(output) {
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
