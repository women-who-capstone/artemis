'use strict';
const db = require('../server/db');
const User = require('../server/db/models/user');
const Channel = require('../server/db/models/channel');

const users = require('./usersSeed');
const channels = require('./channelSeed');

const seed = async () => {
	await db.sync({ force: true });

	await Promise.all(users.map((user) => User.create(user)));

	await Promise.all(channels.map((channel) => Channel.create(channel)));

	const allChannels = await Channel.findAll();
	const allUsers = await User.findAll();

	await Promise.all(
		allChannels.map(async (channel) => {
			const randomIndex = Math.floor(Math.random() * allUsers.length);
			channel.setUser(allUsers[randomIndex]);
			return channel.save();
		})
	);

	console.log('seeding success!');
	db.close();
};
if (module === require.main) {
	seed().catch((err) => {
		console.error('Oh noes! Something went wrong!');
		console.error(err);
		db.close();
	});
}

module.exports = seed;
