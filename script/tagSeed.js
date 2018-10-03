'use strict';
const db = require('../server/db');
const Tag = require('../server/db/models')
const tagNames = ['flute', 'player', 'breaks', 'British', 'museum', 'million', 'dollars', 'dead', 'birds']

const randomScore = () => {
  return Math.random()
}

const randomAmountOfTagsFromAvailableTags = numberTagNames => {
  return Math.floor(Math.random() * numberTagNames)
}

const createTagsForChannel = async () => {
  const builtTags = []
  let newTag
  const length = randomAmountOfTagsFromAvailableTags(tagNames.length)
  for (let i = 0; i < length; i++) {
    newTag = Tag.create({
      name: tagNames[i]
    })
    builtTags.push(newTag)
  }
  let createdTags = await Promise.all(builtTags)
  return createdTags
}

const assignTagsToChannel = async (channel, tags) => {
  const associatedTags = tags.map(tag => {
    tag.setChannel(channel)
    return tag.save()
  })
  return Promise.all(associatedTags)
}

const assignScoresToTags = async () => {
  let channelTags = await ChannelTag.findAll()
  let scoredTags = channelTags.map(channelTag => channelTag.update({ score: Math.random()}))
  return Promise.all(scoredTags)
}

const seed = async (channels, tagNames) => {

}
