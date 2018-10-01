class ChannelVector {
  constructor(channelTags) {
    //console.log('channelTags', channelTags)
    const vector = []
    for (let i = 0; i < channelTags.length; i++) {
      vector[channelTags[i].tagId] = channelTags[i].score
    }

    this.id = channelTags[0].channelId
    this.vector = vector
  }

  formatVectorForVectorAttribute(vector) {
    return JSON.stringify(vector)
  }
}

module.exports = {
  ChannelVector
}

