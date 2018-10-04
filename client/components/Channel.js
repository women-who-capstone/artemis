import React from 'react';
import PodcastPlayer from './player/PodcastPlayer';
import { connect } from 'react-redux';
import axios from 'axios';
import { getRandomIndex, convertPlayedEpisodesArrayToObject } from '../utilities'

class SingleChannel extends React.Component {

  constructor() {
    super();
    this.state = {
      episode: {},
      playedEpisodes: {},
      unfinishedEpisode: {}
    };
    this.setEpisode = this.setEpisode.bind(this);
    this.handleEpisodeEnd = this.handleEpisodeEnd
  }

  setEpisode = async function(podcastId) {
    const channelId = this.props.match.params.channelId;
    const res = await axios.get(`/api/episode/apiEpisode?id=${podcastId}`);
    const episode = res.data.episodes[0];
    episode.channelId = channelId;
    let req = await axios.post("/api/episode", episode);
    let newEpisode = req.data;
    return newEpisode
  };

  setTags = async function() {
    const description = this.state.episode.description;
  };

  //when Next, Dislike or Like is clicked => have function that updates the store with new episode relating to tags.

  async componentDidMount() {
    const playedEpisodes = this.fetchPlayedEpisodes()
    this.setState({
      playedEpisodes
    })
    const newEpisode = this.getNewEpisode()

    this.setState({
      episode: newEpisode,
      unfinishedEpisode: newEpisode
    });
  }

  async fetchPlayedEpisodes() {
    let res = await axios.get(
      `/api/channel?id=${this.props.match.params.channelId}`
    );
    let playedEpisodes = res.data[0].episodes;
    return convertPlayedEpisodesArrayToObject(playedEpisodes)
  }

  extractMostRecentlyPlayedEpisode() {
    let episodeDates = playedEpisodes.map(episode =>
      new Date(episode.date).getTime()
    );
    let currentEpisodeDate = Math.max(...episodeDates);
    let currentEpisode = playedEpisodes.find(
      episode => new Date(episode.date).getTime() === currentEpisodeDate
    );
  }

  getNewEpisodeFromCategoryPodcast() {
    const { bestCategoryPodcasts } = this.props
    let counter = 0

    while (episodeHasNotBeenPlayed(episode)) {
      let podcastIndex, podcast, episodeIndex, episode

      podcastIndex = getRandomIndex(bestCategoryPodcasts.length)
      podcast = bestCategoryPodcasts[podcastIndex]

      episodeIndex = getRandomIndex(podcast.episodes.length)
      episode = podcast.episodes[episodeIndex]

      counter++
      if (counter > 25) {
        break
      }
    }
    return episode
  }

  episodeHasNotBeenPlayed(episode) {
    if (episode === undefined) {
      return false
    }
    return playedEpisodes[episode.id]
  }

  getNewEpisode() {
    let newEpisode
    if (this.props.recommendedEpisodes.length === 0) {
      newEpisode = this.getNewEpisodeFromCategoryPodcast();
      //this.setTags()
    } else if (this.state.unfinishedEpisode.id) {
      newEpisode = this.extractMostRecentlyPlayedEpisode()
    }
    return newEpisode
  }

  handleEpisodeEnd() {
    getNewEpisode()
  }

  render() {
    if (this.state.episode.audio || this.state.episode.audioURL) {
      return <PodcastPlayer episode={this.state.episode} handleEpisodeEnd={this.handleEpisodeEnd}/>;
    }
    return <div />;
  }
}

const mapStateToProps = (state) => {
	return {
    bestCategoryPodcasts: state.podcast.bestCategoryPodcasts,
    recommendedEpisodes: state.podcast.recommendedEpisodes
		// podcastId: state.podcast.podcast.id,
  //   podcastList: state.podcast.podcastList
	};
};

// const mapDispatchToProps = dispatch => {
//   return {
//     setSinglePodcast: episode => dispatch(setSinglePodcast(episode)),
//     setPodcastList: episodes => dispatch(setPodcastList(episodes))
//   };
// };

export default connect(mapStateToProps, null)(SingleChannel);
