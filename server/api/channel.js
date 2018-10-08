const router = require("express").Router();
const { ChannelVector } = require("../../recommendations/utilities");
// const channelVector = new ChannelVector();

const {
  Channel,
  Tag,
  Genre,
  Episode,
  ChannelEpisode,
  ChannelTag
} = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const channels = await Channel.findAll({
        where: req.query,
        include: [
          {
            model: Episode,
            through: ChannelEpisode
          }
        ]
      });
      res.status(200).send(channels);
    } else {
      const channels = await Channel.findAll({});
      res.status(200).send(channels);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/user", async (req, res, next) => {
  const userId = req.session.passport.user;
  try {
    const channels = await Channel.findAll({
      where: {
        userId
      }
    });
    res.status(200).send(channels);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/episodes", async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id, {
      include: [{ model: Episode }]
    });
    res.send(channel.episodes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id, {
      include: [
        {
          model: ChannelTag
        },
        {
          model: Episode,
          through: ChannelEpisode
        },
        {
          model: Genre
        }
      ]
    });
    res.status(200).send(channel);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let channelObj = req.body;
    channelObj.userId = req.user.id;
    const newChannel = await Channel.create(channelObj);
    res.status(200).send(newChannel);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id, {
      include: [
        {
          model: ChannelTag
        },
        {
          model: Genre
        }
      ]
    });
    const newVectorValue = new ChannelVector(channel.channelTags);
    console.log("newvector", newVectorValue.vector);
    const updatedChannel = await Channel.update(
      { vector: newVectorValue },
      {
        where: {
          id: id
        }
      }
    );
    res.status(200).send(updatedChannel);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
