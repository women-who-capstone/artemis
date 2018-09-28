const {expect} = require('chai')
const db = require('../server/db')
const Channel = db.model('channel')
const Tag = db.model('tag')
const ChannelTag = db.model('channelTag')
const User = db.model('user')
const { ChannelVector } = require('./utilities')

describe.only('Collab', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('Collab methods', () => {
    let channel1, channel1WithTags
    let channelTag, channelTag1, channelTag2, channelTag3
    let user1, user2, user3, user4, user5, user6, user7, user8, user9, user10
    let tag1, tag2, tag3

    beforeEach(async () => {
      user1 = await User.create({
        email: 'user@email.com',
        password: '1234'
      })
      channel1 = await Channel.create({
        name: 'Web Design',
        userId: user1.id
      })

      tag1 = await Tag.create({
        name: 'css',
      })
      await tag1.setChannels([channel1])
      tag2 = await Tag.create({
        name: 'responsive',
        channelId: channel1.id,
      })
      await tag2.setChannels([channel1])
      tag3 = await Tag.create({
        name: 'wireframes',
        channelId: channel1.id,
      })
      await tag3.setChannels([channel1])
    })

    xdescribe('whether I am writing the relevant Sequelize queries correctly', () => {
      beforeEach(async () => {
        channelTag = await ChannelTag.findAll({
          where: {
            channelId: channel1.id
          }
        })
      })

      it(`returns channel's tags`, (done) => {
        expect(channelTag).to.be.an('array')
        done()
      })

      it('has all the tags added', () => {
        expect(channelTag.length).to.equal(3)
      })
    }) // end describe('whether I am writing the relevant Sequelize queries correctly')

    xdescribe('ChannelVector constructor', () => {
      beforeEach(async () => {
        channelTag = await ChannelTag.findAll({
          where: {
            channelId: channel1.id
          }
        })
        const updatedTags = channelTag.map(elem => elem.update({ score: elem.tagId / 10 }))
        await Promise.all(updatedTags)
      })

      it('returns an object with id and vector', () => {
        const vector = new ChannelVector(channelTag)
        expect(vector.id).to.equal(channel1.id)
        expect(vector.vector.length).to.equal(4)
      })

      it(`the returned object's vector key contains the correct score`, () => {
        const vector = new ChannelVector(channelTag)
        expect(vector.vector[1]).to.equal(0.1)
        expect(vector.vector[2]).to.equal(0.2)
        expect(vector.vector[3]).to.equal(0.3)
      })
    }) // end describe('ChannelVector constructor')

    describe('getClosestNChannels', () => {
      let tags
        let chanTags
        let updatedChanTags
        let chanTagsWithScores
        let userChannelTag
        let userChannelVector
        let otherChannelsVectors
        const otherChanTagsWithScores = []

      beforeEach(async () => {
        const otherChannels = await Channel.bulkCreate([
          {name: 'channel2'},
          {name: 'channel3'},
          {name: 'channel4'},
          {name: 'channel5'},
          {name: 'channel6'},
          {name: 'channel7'},
          {name: 'channel8'},
          {name: 'channel9'}
        ])

        for (let i = 0; i < otherChannels.length; i++) {
          tags = await Tag.bulkCreate([
            { name: 'css', channelId: otherChannels[i].id},
            { name: 'responsive', channelId: otherChannels[i].id},
            { name: 'wireframes', channelId: otherChannels[i].id}
          ])
          chanTags = await ChannelTag.findAll({
            where: {
              channelId: otherChannels[i].id
            }
          })
          updatedChanTags = chanTags.map((chanTag, index) => chanTag.update({score: (index + 1 + i) / 10}))
          chanTagsWithScores = await Promise.all(updatedChanTags)
          otherChanTagsWithScores.push(chanTagsWithScores)
        }
        channelTag = await ChannelTag.findAll({
          where: {
            channelId: channel1.id
          }
        })
        userChannelTag = await ChannelTag.findAll({
          where: {
            channelId: channel1.id
          }
        })
        const updatedTags = channelTag.map(elem => elem.update({ score: elem.tagId / 10 }))
        await Promise.all(updatedTags)

      })

      it(`returns the ids of the channels closest to the user's channel`, () => {
        console.log('otherChanTagsWithScores', otherChanTagsWithScores)
        userChannelVector = new ChannelVector(userChannelTag)
        otherChannelsVectors = otherChanTagsWithScores.map(chanTag => new ChannelVector(chanTag))
      })
    })
  }) // end describe('Collab methods')
}) // end describe('Collab')
