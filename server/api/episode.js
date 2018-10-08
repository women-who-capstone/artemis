const router = require("express").Router();
const unirest = require("unirest");
const {
  Episode,
  ChannelEpisode,
  Channel,
  ChannelTag
} = require("../db/models");
const Recommender = require("../../recommendations/collab");
// const recommender = new Recommender();
module.exports = router;

router.get('/', async (req, res, next) => {
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

router.get("/next", async (req, res, next) => {
  try {
    const userChannel = await Channel.findById(req.query.channelId, {
      include: [
        { model: ChannelTag },
        {
          model: Episode,
          through: ChannelEpisode
        }
      ]
    });
    const allChannels = await Channel.findAll({
      include: [{ model: ChannelTag }]
    });
    const allOtherChannels = allChannels.filter(channel => {
      // console.log("Channel.id", channel.id, "channelid", req.query.channelId);
      return channel.id != req.query.channelId;
    });
    // console.log("ALL OTHER CHANNELS", allOtherChannels);
    const recommender = new Recommender(userChannel, allOtherChannels);
    // console.log(recommender);
    const episode = await recommender.getRecommendedEpisode();
    res.status(200).send(episode);
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

router.get('/:episodeId', async (req, res, next) => {
	try {
		const singleEpisode = await Episode.findById(req.params.episodeId);
		res.status(200).send(singleEpisode);
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	const episodeObj = {
		title: req.body.title,
		date: Date.now(),
		imageURL: req.body.image,
		audioURL: req.body.audio,
		length: req.body.audio_length,
		description: req.body.description
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

router.post("/nextEpisode", async (req, res, next) => {
  try {
    // console.log("QUERY", req.body);
    const episode = await ChannelEpisode.create({
      episodeId: req.body.episodeId,
      channelId: req.body.channelId
    });
    res.status(200).send(episode);
  } catch (err) {
    next(err);
  }
});
