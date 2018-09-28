const formatChannelForRecommendation = channel => {
  //assuming this is join table of channels and tags
  const id = channel.channelId
  let vector =

  for (let i = 0; i < channel.tags.length; i++) {
    vector[channel.tagId] = channel.score
  }

  return { id, vector }
}

const findLongestLength = channels => { //channels is array of objects that contain and id and an array
  let maxLength = -Infinity
  channels.forEach(channel => {
    if (channel.vector.length > maxLength) {
      maxLength = channel.vector.length
    }
  })
  return maxLength
}

const ensureVectorsAreSameLength = (channels, maxLength) => { //channels is array of objects that contain and id and an array
  let numAdditionalElements
  return channels.map(channel => {
    if (channel.vector.length < maxLength) {
      numAdditionalElements = maxLength - channel.length
      for (let i = 0; i < numAdditionalElementsl i++) {
        channel.vector.push(0.5)
      }
    }
    return channel
  })
}

module.exports = {
  formatChannelForRecommendation
}
