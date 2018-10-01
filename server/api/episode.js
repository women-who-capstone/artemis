const router = require("express").Router();
const unirest = require("unirest");
const { Episode, ChannelEpisode, Channel } = require("../db/models");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const episodes = await Episode.findAll({
      include: [
        {
          model: Channel,
          through: ChannelEpisode
        }
      ]
    });
    res.status(200).send(episodes);
  } catch (err) {
    next(err);
  }
});

router.get("/apiEpisode", async (req, res, next) => {
  const id = req.query.id;
  try {
    unirest
      .get(
        `https://listennotes.p.mashape.com/api/v1/podcasts/${id}/?sort=recent_first`
      )
      .header("X-Mashape-Key", process.env.xMashKey)
      .header("Accept", "application/json")
      .end(function(result) {
        res.status(200).send(result.body);
      });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const episodeObj = {
    title: req.body.title,
    date: Date.now(),
    imageURL: req.body.image,
    audioURL: req.body.audio,
    length: req.body.audio_length
  };
  try {
    const episode = await Episode.create(episodeObj);
    await ChannelEpisode.create({
      episodeId: episode.id,
      channelId: req.body.channelId
    });
    // console.log("this is assocition", episode);
    res.status(200).send(episode);
  } catch (err) {
    next(err);
  }
});
