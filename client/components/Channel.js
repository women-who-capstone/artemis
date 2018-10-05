import React from 'react';
import { withRouter } from 'react-router'
import PodcastPlayer from './player/PodcastPlayer';
import { connect } from 'react-redux';
import axios from 'axios';
import { getRandomIndex, convertPlayedEpisodesArrayToObject, getGenreIdFromGenreName } from '../utilities'
import { setSinglePodcast, setPodcastList, fetchCategoryPodcastsEpisodeData } from "../reducers/podcast";
import genres from '../genreList'
class SingleChannel extends React.Component {

  constructor() {
    super();
    this.state = {
      episode: {},
      playedEpisodes: {},
      unfinishedEpisode: {},
      episodeQueue: []
    };
    this.setEpisode = this.setEpisode.bind(this);
    this.getEpisodeFromQueue = this.getEpisodeFromQueue.bind(this)
    this.handleSkip = this.handleSkip.bind(this)

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
    //get channel name
    //get genre id
    //get episodes
    //${this.props.match.params.id}
    console.log(this.props)
    await this.getGenrePodcasts()
    const playedEpisodes = await this.fetchPlayedEpisodes()
    console.log('playedEpisodes', playedEpisodes)
    const episodeQueue = this.getEpisodeQueue(5)
    this.setState({
      episodeQueue,
      playedEpisodes,
    })

    const newEpisode = this.getEpisodeFromQueue()
    this.setState({
      episode: newEpisode,
      unfinishedEpisode: newEpisode
    })
  }

  async getGenrePodcasts() {
    console.log('genres', genres)
    const { data: channel } = await axios.get(`/api/channel/${this.props.match.params.channelId}`)
    const genreId = getGenreIdFromGenreName(channel.name, genres)
    const { data: podcastsWithoutData } = await axios.get(`/api/podcast?id=${genreId}`)
    this.props.fetchCategoryPodcastsEpisodeData(podcastsWithoutData)
  }
//
  async fetchPlayedEpisodes() {
    let res = await axios.get(
      `/api/channel?id=${this.props.match.params.channelId}`
    );
    let playedEpisodes = res.data[0].episodes;

    const episodesObject = convertPlayedEpisodesArrayToObject(playedEpisodes)
    return episodesObject
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
    let podcastIndex, podcast, episodeIndex, episode
    console.log('been played', this.episodeHasNotBeenPlayed(episode))
    while (!this.episodeHasNotBeenPlayed(episode)) {

      podcastIndex = getRandomIndex(bestCategoryPodcasts.length)
      podcast = bestCategoryPodcasts[podcastIndex]

      episodeIndex = getRandomIndex(podcast.episodes.length)
      episode = podcast.episodes[episodeIndex]
      console.log('episode', episode)
      counter++
      if (counter > 25) {
        break
        //we should get new episodes at this point
      }
    }
    return episode
  }

  episodeHasNotBeenPlayed(episode) {
    if (episode === undefined) {
      return false
    }
    if (this.state.playedEpisodes[episode.id]) {
      return false
    }
    return true
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

  getEpisodeQueue(numDesiredEpisodes) {
    const queue = []

    for (let i = 0; i < numDesiredEpisodes; i++) {
      queue.push(this.getNewEpisode())
    }

    return queue
  }

  getEpisodeFromQueue() {
    const queueCopy = this.state.episodeQueue.slice(0)
    const episode = queueCopy.shift()
    this.setState({
      episodeQueue: queueCopy
    })
    return episode
  }

  handleEpisodeNearEnd() {
    //add episode to queue
  }

  handleEpisodeEnd() {
    //add current episode to played episode
    //get episode from queue
  }

  handleSkip() {
    const newEpisode  = this.getEpisodeFromQueue()
    this.setState({
      episode: newEpisode
    })
    //add current episode to played episode
  }

  render() {

    if ((this.state.episode.audio || this.state.episode.audioURL)) {
      //
      return <PodcastPlayer episode={this.state.episode} episodeQueue={this.state.episodeQueue} handleSkip={this.handleSkip}/>;
    }
    console.log('bestCategory', this.props.bestCategoryPodcasts)
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

const mapDispatchToProps = dispatch => {
  return {
    // setSinglePodcast: podcast => dispatch(setSinglePodcast(podcast)),
    // setPodcastList: podcasts => dispatch(setPodcastList(podcasts)),
    fetchCategoryPodcastsEpisodeData: podcasts => dispatch(fetchCategoryPodcastsEpisodeData(podcasts))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleChannel));
