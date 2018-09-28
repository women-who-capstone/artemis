class ChannelVector {
  constructor(channel) {
    const vector = []
    for (let i = 0; i < channel.tags.length; i++) {
      vector[channel.tagId] = channel.score
    }

    this.id = channel.channel.id
    this.vector = vector
  }

  formatVectorForVectorAttribute(vector) {
    return JSON.stringify(vector)
  }
}

module.exports = {
  ChannelVector
}
