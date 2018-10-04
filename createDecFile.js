const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');



// csv
// 	.fromStream(stream, { headers: headers })
// 	.on('data', function(data) {
// 		descriptions.push('Descriptions');
// 	})
// 	.on('end', function() {
// 		var file = fs.createWriteStream('descriptions.js');
// 		file.on('error', function(err) {
// 			console.log('error handle', err.message);
// 		});
const init = async () => {
	let descriptions = [];
	var stream = await fs.createReadStream(path.join(__dirname, 'podcasts.csv'));
	const headers = [ , , , , , , , , 'Description' ];
	csv
		.fromStream(stream, { headers })
		.on('data', function(data) {
			descriptions.push(data['Description']);
		})
		.on('end', async function() {
			var file = await fs.createWriteStream('descriptions.js');
			file.on('error', function(err) {
				console.log('error handle', err.message);
			});
			var file = await fs.createWriteStream('descriptions.js');
			await file.on('error', function(err) {
				console.log('error handle', err.message);
			});
			// console.log('SKJDBFLJSDKBFOADJLKBVEJK V', Array.isArray(descriptions));
			// descriptions = [ 'one', 'two', '紹介して参ります。時には車の' ];
			await file.write('let descriptions = [');
			// const arrDescriptions = JSON.stringify(descriptions);
			descriptions.forEach(async (item) => await file.write(`\`${item}\`, `));

			// console.log('ARRDESCRIPTIONS', arrDescriptions);
			// await file.write(arrDescriptions);

			await file.write('];\nmodule.exports = descriptions;');
		});
};
init();

// file.on('finish', function() {
// 	console.log('finished');
// });
// });
