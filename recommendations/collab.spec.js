const {expect} = require('chai')
const db = require('../server/db')
const Channel = db.model('channel')
const Tag = db.model('tag')
const ChannelTag = db.model('channelTag')
const User = db.model('user')
const { ChannelVector } = require('./utilities')
const Recommender = require('./collab')

describe('Collab', () => {
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

    describe('whether I am writing the relevant Sequelize queries correctly', () => {
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
    })

    describe('ChannelVector constructor', () => {
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
    })

    describe.only('getClosestNChannels', () => {
      it(`returns the n channels closest to the user's channel`, () => {
        const userChannel = {
          id: 1,
          vector: [null, 0.1, 0.2, 0.3]
        }

        const otherChannels = [
          { id: 2, vector: [null, 0.2, 0.3, 0.4] },
          { id: 3, vector: [null, 0.3, 0.4, 0.5] },
          { id: 4, vector: [null, 0.4, 0.5, 0.6] },
          { id: 5, vector: [null, 0.5, 0.6, 0.7] },
        ]
        const recommender = new Recommender(userChannel, otherChannels)
        const closestChannels = recommender.getClosestNChannels(2)
        expect(closestChannels.length).to.equal(2)
        expect(closestChannels[0].id).to.equal(2)
      })

      it(`returns the correct distances`, () => {
        const userChannel = {
          id: 1,
          vector: [null, 0.1, 0.2, 0.3]
        }

        const otherChannels = [
          { id: 2, vector: [null, 0.2, 0.3, 0.4] },
          { id: 3, vector: [null, 0.3, 0.4, 0.5] },
          { id: 4, vector: [null, 0.4, 0.5, 0.6] },
          { id: 5, vector: [null, 0.5, 0.6, 0.7] },
        ]
        const recommender = new Recommender(userChannel, otherChannels)
        const closestChannels = recommender.getClosestNChannels(2)
        expect(closestChannels[0].distance.toFixed(2)).to.equal('0.17')
        expect(closestChannels[1].distance.toFixed(2)).to.equal('0.35')
      })
    })// end describe('GetClosestNChannels')
  }) // end describe('Collab methods')
}) // end describe('Collab')
