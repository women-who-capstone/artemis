const router = require("express").Router();

const { Channel, Tag, Genre } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const channels = await Channel.findAll({
        where: req.query
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

router.get('/user', async (req, res, next) => {
  const userId = req.session.passport.user
  try {
    const channels = await Channel.findAll({
      where: {
        userId
      }
    })
    res.status(200).send(channels)
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const channel = await Channel.findById(id, {
      include: [
        {
          model: Tag
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

module.exports = router;
