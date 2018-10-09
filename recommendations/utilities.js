const { Channel, Episode, ChannelEpisode } = require("../server/db/models");

class ChannelVector {
  constructor(channelTags) {
    const vector = [];
    for (let i = 0; i < channelTags.length; i++) {
      vector[channelTags[i].tagId] = channelTags[i].score;
    }

    this.id = channelTags.channelId;
    this.vector = vector;
  }

  formatVectorForVectorAttribute(vector) {
    return JSON.stringify(vector);
  }
}

class ChannelEpisodeGetter {
  constructor(channelId, currentChannelEpisodes) {
    this.channelId = channelId;
    this.alreadyPlayed = currentChannelEpisodes;
  }

  _getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  async _getEpisodes() {
    try {
      const channel = await Channel.findById(this.channelId, {
        include: [{ model: Episode, through: ChannelEpisode }]
      });
      let alreadyPlayed = this.alreadyPlayed;
      let channelEpisodes = channel.episodes.filter(
        episode => alreadyPlayed.indexOf(episode.id) === -1
        //&& episode.channelEpisode.liked
      );
      return channelEpisodes; // returns promise for array of episodes
    } catch (error) {
      console.error(error);
    }
  }

  async getMostRecentEpisode() {
    try {
      let episodes = await this._getEpisodes();
      episodes.sort((a, b) => b.date - a.date);
      return episodes[0];
    } catch (error) {
      console.error(error);
    }
  }

  async getRandomEpisode() {
    try {
      const episodes = await this._getEpisodes();
      const randomIndex = this._getRandomIndex(episodes.length);
      return episodes[randomIndex];
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  ChannelVector,
  ChannelEpisodeGetter
};
