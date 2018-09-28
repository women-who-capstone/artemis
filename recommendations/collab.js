class Recommender {
  // userChannel is object containing an id and an array {id, vector},
  // allOtherChannels is array of arrays with the same shape as userChannel
  constructor(userChannel, allOtherChannels) {
    this.userChannel = userChannel
    this.allOtherChannels = allOtherChannels
  }

  getDistanceBetweenTwoVectors(vector1, vector2) {
    return Math.sqrt(vector1
    .map((point, index) => {
      return Math.pow((point || 0.5 - vector2[index] || 0.5), 2)
    })
    .reduce((accum, curr) => {
      return accum + curr
    }, 0))
  }

  getDistancesBetweenUserChannelAndAllOtherChannels() {
    return allOtherChannels.map(channel => {
      return { id: channel.id, distance: this.getDistanceBetweenTwoVectors(this.userChannel.vector, channel.vector) }
    })
  }

  sortChannelsByDistance(channels) {
    channels.sort((a, b) => a.distance - b.distance)
    return channels
  }

  getClosestNChannels(n) {
    const distances = getDistancesBetweenUserChannelAndAllOtherChannels()
    const sortedDistances = sortChannelsByDistance(distances)
    return sortedDistances.slice(0, n)
  }
}

module.exports = Recommender
