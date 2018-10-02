const Sequelize = require("sequelize");
const db = require("../db");

const ChannelGenre = db.define("channelGenre", {
  score: {
    type: Sequelize.INTEGER
  }
});
module.exports = ChannelGenre;
