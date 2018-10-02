const router = require('express').Router();
const unirest = require('unirest');
const algorithmia = require('algorithmia');

const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');

var stream = fs.createReadStream(path.join(__dirname, 'podcasts.csv'));
const headers = [, , , , , , , , 'Description'];

let descriptions = [];
csv
  .fromStream(stream, { headers: headers })
  .on('data', function(data) {
    descriptions.push(data['Description']);
  })
  .on('end', function() {
    console.log('done');
  });

router.get('/', async (req, res, next) => {
  try {
    // let input = req.query.input;
    //input = input.map(e => JSON.parse(e));
    let input = [descriptions, 5];
    //console.log('req', input);
    algorithmia
      .client(process.env.apiKey)
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
