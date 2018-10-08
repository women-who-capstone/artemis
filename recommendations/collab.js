const { ChannelEpisodeGetter } = require("./utilities");
const { ChannelVector } = require("./utilities");
class Recommender {
  // userChannel is object containing an id and an array {id, vector},
  // allOtherChannels is array of arrays with the same shape as userChannel
  constructor(userChannel, allOtherChannels) {
    this.userChannel = userChannel;
    this.allOtherChannels = allOtherChannels;
  }

  getDistanceBetweenTwoVectors(vector1, vector2) {
    // console.log("vector1", vector1);
    return Math.sqrt(
      vector1
        .map((point, index) => {
          return Math.pow((point || 0.5) - (vector2[index] || 0.5), 2);
        })
        .reduce((accum, curr) => {
          return accum + curr;
        }, 0)
    );
  }

  getDistancesBetweenUserChannelAndAllOtherChannels() {
    return this.allOtherChannels.map(channel => {
      return {
        id: channel.id,
        distance: this.getDistanceBetweenTwoVectors(
          new ChannelVector(this.userChannel.channelTags).vector,
          new ChannelVector(channel.channelTags).vector
        )
      };
    });
  }

  sortChannelsByDistance(channels) {
    channels.sort((a, b) => a.distance - b.distance);
    return channels;
  }

  getClosestNChannels(n) {
    const distances = this.getDistancesBetweenUserChannelAndAllOtherChannels();
    const sortedDistances = this.sortChannelsByDistance(distances);
    return sortedDistances.slice(0, n);
  }

  async getRecommendedEpisode() {
    try {
      let playedEps = this.userChannel.episodes;
      // console.log("USERCHANEL EPISODES", playedEps);
      let episodeArray = [];
      for (let i = 0; i < playedEps.length; i++) {
        episodeArray.push(playedEps[i].id);
      }
      // console.log("EP ARRAY", episodeArray);
      const getter = new ChannelEpisodeGetter(
        this.getClosestNChannels(1)[0].id,
        episodeArray
      );
      return await getter.getMostRecentEpisode();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Recommender;
