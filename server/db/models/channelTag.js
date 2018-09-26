const Sequelize = require("sequelize");
const db = require("../db");

const ChannelTag = db.define("channelTag", {
  score: {
    type: Sequelize.INTEGER
  }
});
module.exports = ChannelTag;
