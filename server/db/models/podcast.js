const Sequelize = require("sequelize");
const db = require("../db");

const Podcast = db.define("podcast", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Podcast;
