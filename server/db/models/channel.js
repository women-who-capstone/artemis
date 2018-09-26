const Sequelize = require("sequelize");
const db = require("../db");

const Channel = db.define("channel", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Channel;
