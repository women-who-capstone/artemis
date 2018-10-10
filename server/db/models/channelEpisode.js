const Sequelize = require("sequelize");
const db = require("../db");

const ChannelEpisode = db.define("channelEpisode", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  liked: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = ChannelEpisode;
