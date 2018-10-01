const router = require("express").Router();
const unirest = require("unirest");

router.get("/", async (req, res, next) => {
  try {
    let id = req.query.id;
    unirest
      .get(
        `https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${id}&page=1`
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

module.exports = router;
