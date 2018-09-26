const Sequelize = require("sequelize");
const db = require("../db");

const ChannelHost = db.define("channelHost", {
  score: {
    type: Sequelize.INTEGER
  }
});
module.exports = ChannelHost;
