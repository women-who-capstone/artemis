const Sequelize = require('sequelize');
const db = require('../db');
const Tag = require('../index');

const Channel = db.define('channel', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Channel.prototype.incrementScore = function(epTags) {
  //epTags: array of strings
  const INCREMENTER = 0.1;

  let chanTags = this.getTags();
  chanTags.forEach(chanTag => {
    if (epTags.includes(chanTag.name)) {
      let score = chanTag.score || 0.5;
      Channel.addTag(chanTag, {
        through: {
          score: score * INCREMENTER + score
        }
      });
    }
  });
};

Channel.prototype.decrementScore = function(epTags) {
  const DECREMENTER = 0.2;

  let chanTags = this.getTags();
  chanTags.forEach(chanTag => {
    if (epTags.includes(chanTag.name)) {
      let score = chanTag.score || 0.5;
      Channel.addTag(chanTag, {
        through: {
          score: score - score * DECREMENTER
        }
      });
    }
  });
};

module.exports = Channel;
