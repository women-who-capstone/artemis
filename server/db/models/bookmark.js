const Sequelize = require("sequelize");
const db = require("../db");

const Bookmark = db.define("bookmark", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});

module.exports = Bookmark;
