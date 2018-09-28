const {expect} = require('chai')
const db = require('../server/db')
const Channel = db.model('channel')
const Tag = db.model('tag')
const ChannelTag = db.model('channelTag')
const User = db.model('user')

describe.only('Channel model shape', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let channel1, channel1WithTags
      let channelTag
      let user1
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

        channel1WithTags = await Channel.findById(channel1.id, {
          include: [{model: Tag}]
        })

        channelTag = await ChannelTag.findAll({
          where: {
            channelId: channel1.id
          }
        })
      })

      it(`returns channel's tags`, () => {
        expect(channel1WithTags.tags).to.be.an('array')
      })

      it('has all the tags added', () => {
        expect(channel1WithTags.tags.length).to.equal(3)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')
}) // end describe('User model')
