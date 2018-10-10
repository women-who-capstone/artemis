//model associations go in here

const Genre = require("./genre");
const Channel = require("./channel");
const Episode = require("./episode");
const Host = require("./host");
const Podcast = require("./podcast");
const Tag = require("./tag");
const User = require("./user");
const ChannelTag = require("./channelTag");
const ChannelGenre = require("./channelGenre");
const ChannelPodcast = require("./channelPodcast");
const ChannelHost = require("./channelHost");
const ChannelEpisode = require("./channelEpisode");
const Bookmark = require("./bookmark");

//Tag-Channel Model created to associate Channel Ids with Tag Ids (score as already set attribute)
Channel.belongsToMany(Tag, { through: ChannelTag });
Channel.hasMany(ChannelTag);
Tag.belongsToMany(Channel, { through: ChannelTag });
Tag.hasMany(ChannelTag);

//Genre-Channel Model created to associate Channel Ids with Genre Ids (score as already set attribute)
Channel.belongsToMany(Genre, { through: ChannelGenre });
Channel.hasMany(ChannelGenre);
Genre.belongsToMany(Channel, { through: ChannelGenre });
Genre.hasMany(ChannelGenre);

//Podacast-Channel Model created to associate Channel Ids with Podcast Ids (score as already set attribute)
Channel.belongsToMany(Podcast, { through: ChannelPodcast });
Channel.hasMany(ChannelPodcast);
Podcast.belongsToMany(Channel, { through: ChannelPodcast });

//Podacast-Channel Model created to associate Channel Ids with Host Ids (score as already set attribute)
Channel.belongsToMany(Host, { through: ChannelHost });
Channel.hasMany(ChannelHost);
Host.belongsToMany(Channel, { through: ChannelHost });

//Channel-Episodes CREATES new own table to associates Channel Ids with it's played Episode Ids
Channel.belongsToMany(Episode, { through: ChannelEpisode });
Episode.belongsToMany(Channel, { through: ChannelEpisode });
Episode.hasMany(ChannelEpisode);
Channel.hasMany(ChannelEpisode);
// ChannelEpisode.hasMany(Episode);

//Bookmarks CREATES new own table to associates User Ids with Episode Ids
User.belongsToMany(Episode, { through: Bookmark });
User.hasMany(Bookmark);
Episode.belongsToMany(User, { through: Bookmark });
Episode.hasMany(Bookmark);
// one to many relationships

User.hasMany(Channel);
Channel.belongsTo(User);

module.exports = {
  User,
  Channel,
  Episode,
  Genre,
  Host,
  Podcast,
  Tag,
  ChannelGenre,
  ChannelHost,
  ChannelPodcast,
  ChannelTag,
  ChannelEpisode,
  Bookmark
};
