import React from 'react';
import PodcastPlayer from './player/PodcastPlayer';
import { connect } from 'react-redux';
import axios from 'axios';
import { getRandomIndex, convertPlayedEpisodeArrayToObject } from '../utilities'

class SingleChannel extends React.Component {

  constructor() {
    super();
    this.state = {
      episode: {},
      playedEpisodes: {}
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

    const podcastId = await this.props.podcastId;
    if (podcastId !== undefined) {
      const newEpisode = this.setEpisode(podcastId);
      this.setState({
        episode: newEpisode
      });
      //this.setTags()
    } else {
      const mostRecentlyPlayedEpisode = this.extractMostRecentlyPlayedEpisode()
      this.setState({
        episode: mostRecentlyPlayedEpisode
      });
    }
  }

  async fetchPlayedEpisodes() {
    let res = await axios.get(
      `/api/channel?id=${this.props.match.params.channelId}`
    );
    let playedEpisodes = res.data[0].episodes;
    return convertPlayedEpisodeArrayToObject(playedEpisodes)
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

  extractNewPodcastFromPodcastList() {
    const { podcastList } = this.props
    const randomIndex = getRandomIndex(podcastList.length)
    return podcastList[randomIndex]
  }

  getNewEpisodeFromPodcast(podcast) {

  }

  episodeHasNotBeenPlayed() {

  }

  handleEpisodeEnd() {
    //get new podcast from podcastList podcasts
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
		podcastId: state.podcast.podcast.id,
    podcastList: state.podcast.podcastList
	};
};

// const mapDispatchToProps = dispatch => {
//   return {
//     setSinglePodcast: episode => dispatch(setSinglePodcast(episode)),
//     setPodcastList: episodes => dispatch(setPodcastList(episodes))
//   };
// };

export default connect(mapStateToProps, null)(SingleChannel);
