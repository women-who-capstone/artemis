const Sequelize = require("sequelize");
const db = require("../db");

const ChannelPodcast = db.define("channelPodcast", {
  score: {
    type: Sequelize.INTEGER
  }
});
module.exports = ChannelPodcast;
