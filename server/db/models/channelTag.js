const Sequelize = require("sequelize");
const db = require("../db");

const ChannelTag = db.define("channelTag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  score: {
    type: Sequelize.DECIMAL
  }
});
module.exports = ChannelTag;
