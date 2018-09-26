const Sequelize = require("sequelize");
const db = require("../db");

const Host = db.define("host", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Host;
