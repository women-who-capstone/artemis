import React from "react";
import { withRouter } from "react-router";
import PodcastPlayer from "./player/PodcastPlayer";
import { connect } from "react-redux";
import axios from "axios";
import {
  getRandomIndex,
  convertPlayedEpisodesArrayToObject,
  getGenreIdFromGenreName
} from "../utilities";
import {
  setSinglePodcast,
  setPodcastList,
  fetchCategoryPodcastsEpisodeData,
  fetchPlayedEpisodes,
  addPlayedEpisode,
  fetchRecommendedEpisodes
} from "../reducers/podcast";
import genres from "../genreList";

class SingleChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      episode: {},
      unfinishedEpisode: {},
      episodeQueue: [],
      tags: [],
      vector: [],
      tags: []
    };
    //this.setEpisode = this.setEpisode.bind(this);
    this.getEpisodeFromQueue = this.getEpisodeFromQueue.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleEpisodeEnd = this.handleEpisodeEnd.bind(this);
    this.addNewEpisodeToQueue = this.addNewEpisodeToQueue.bind(this)

    this.setEpisode = this.setEpisode.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setNewEpisode = this.setNewEpisode.bind(this);
    // this.updateVector = this.updateVector.bind(this);
  }


  setEpisode = async function(episodeId) {
    const channelId = this.props.match.params.channelId;
    const res = await axios.get(`/api/episode/apiEpisode?id=${episodeId}`);
    const episode = res.data.episodes[0];
    episode.channelId = channelId;
    let req = await axios.post('/api/episode', episode);
    let newEpisode = req.data;
    this.setState({
      episode: newEpisode
    });
    this.setTags(newEpisode);
    this.props.setSinglePodcast({});
  };

  setNewEpisode = async function(episode) {
    let episodeId = episode.id;
    let channelId = this.props.match.params.channelId;
    // await axios.post("/api/episode/nextEpisode", {
    //   episodeId,
    //   channelId
    // });
    this.setState({
      episode
    });
    await axios.post("/api/episode/nextEpisode", {
      episodeId,
      channelId
    });
    this.setTags(episode);
  };

  setTags = async function(episode) {
    // console.log(episode);
    const description = episode.description;
    const res = await axios.get("/api/keywords", {
      params: {
        input: description,
        channelId: this.props.match.params.channelId
      }
    });
    const tags = res.data;
    this.setState({
      tags
    });
    // this.updateVector(tags);
  };

  // updateVector = async function(tags) {
  //   const vectorRes = await axios.put(
  //     `/api/channel/${this.props.match.params.channelId}`,
  //     { tags: tags }
  //   );
  // };

  //when Next, Dislike or Like is clicked => have function that updates the store with new episode relating to tags.

  async componentDidMount() {
    const { channelId } = this.props.match.params
    await this.getGenrePodcasts();
    await this.props.fetchPlayedEpisodes(channelId);
    //await this.props.fetchRecommendedEpisodes(channelId)

    const episodeQueue = this.getEpisodeQueue(5);
    this.setState({
      episodeQueue
    });

    const newEpisode = this.getEpisodeFromQueue();
    this.setState({
      episode: newEpisode,
      unfinishedEpisode: newEpisode
    });
  }

  async getGenrePodcasts() {
    const { data: channel } = await axios.get(
      `/api/channel/${this.props.match.params.channelId}`
    );
    const genreId = getGenreIdFromGenreName(channel.name, genres);
    const { data: podcastsWithoutData } = await axios.get(
      `/api/podcast?id=${genreId}`
    );

    await this.props.fetchCategoryPodcastsEpisodeData(
      podcastsWithoutData.channels
    );
  }

  extractMostRecentlyPlayedEpisode() {
    let episodeDates = this.state.playedEpisodes.map(episode =>
      new Date(episode.date).getTime()
    );

    let currentEpisodeDate = Math.max(...episodeDates);
    let currentEpisode = this.props.playedEpisodes.find(
      episode => new Date(episode.date).getTime() === currentEpisodeDate
    );
  }

  getNewEpisodeFromRecommendedEpisodes() {

  }

  getNewEpisodeFromCategoryPodcast() {
    const { bestCategoryPodcasts } = this.props;
    let counter = 0;
    let podcastIndex, podcast, episodeIndex, episode;

    while (!this.episodeHasNotBeenPlayed(episode)) {
      podcastIndex = getRandomIndex(bestCategoryPodcasts.length);
      podcast = bestCategoryPodcasts[podcastIndex];

      episodeIndex = getRandomIndex(podcast.episodes.length);
      episode = podcast.episodes[episodeIndex];

      counter++;
      if (counter > 25) {
        this.getGenrePodcasts();
        return episode
      }
    }
    return episode;
  }

  episodeHasNotBeenPlayed(episode) {

    if (episode === undefined) {
      return false;
    }
    if (this.props.playedEpisodes[episode.id]) {
      return false;
    }

    return true;
  }

  getNewEpisode() {
    let newEpisode;
    if (!this.props.recommendedEpisodes.length) {
      newEpisode = this.getNewEpisodeFromCategoryPodcast();
    } else {
      //gets new recommended episodes
      //newEpisode = this.getNewEpisodeFromRecommendedEpisodes()
    }
    return newEpisode;
  }

  getEpisodeQueue(numDesiredEpisodes) {
    const queue = [];

    for (let i = 0; i < numDesiredEpisodes; i++) {
      queue.push(this.getNewEpisode());
    }

    return queue;
  }

  addNewEpisodeToQueue() {
    const newEpisode = this.getNewEpisode()
    this.setState({
      episodeQueue: [...this.state.episodeQueue, newEpisode]
    })
  }

  getEpisodeFromQueue() {
    const queueCopy = this.state.episodeQueue.slice(0);
    const episode = queueCopy.shift();
    this.setState({
      episodeQueue: queueCopy
    });
    return episode;
  }

  async handleEpisodeEnd() {
    //add episode that just ended to played episodes
    const episodeThatJustEnded = this.state.episode
    const channelId = this.props.match.params.channelId
    await this.props.addPlayedEpisode(episodeThatJustEnded, channelId)

    //get new episode from queue
    const newEpisode = this.getEpisodeFromQueue();
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue()
  }

  async handleSkip() {
    //add episode that was playing before skip to played episodes
    const episodeSkipped = this.state.episode
    const channelId = this.props.match.params.channelId
    await this.props.addPlayedEpisode(episodeSkipped, channelId)

    //get new episode
    const newEpisode = this.getEpisodeFromQueue();
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue()
    // const episodeId = await this.props.episodeId;
    // if (episodeId !== undefined) {
    //   this.setEpisode(episodeId);
    // } else {
    //   let res = await axios.get(
    //     `/api/channel?id=${this.props.match.params.channelId}`
    //   );
    //   let playedEpisodes = res.data[0].episodes;
    //   // console.log(playedEpisodes);
    //   let episodeDates = playedEpisodes.map(episode =>
    //     new Date(episode.date).getTime());
    //   let currentEpisodeDate = Math.max(...episodeDates);
    //   let currentEpisode = playedEpisodes.find(
    //     episode => new Date(episode.date).getTime() === currentEpisodeDate
    //   );
      // this.setState({
      //   episode: currentEpisode
      // });
    //this.setTags(); //
  }

  render() {
    if (this.state.episode.audio || this.state.episode.audioURL) {

      return (
        <PodcastPlayer
          episode={this.state.episode}
          episodeQueue={this.state.episodeQueue}
          handleSkip={this.handleSkip}
          handleEpisodeEnd={this.handleEpisodeEnd}
          channelId={this.props.match.params.channelId}
          setNewEpisode={this.setNewEpisode}
        />
      );
    }
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    bestCategoryPodcasts: state.podcast.bestCategoryPodcasts,
    recommendedEpisodes: state.podcast.recommendedEpisodes,
    playedEpisodes: state.podcast.playedEpisodes,
    episodeId: state.podcast.podcast.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategoryPodcastsEpisodeData: podcasts =>
      dispatch(fetchCategoryPodcastsEpisodeData(podcasts)),
    fetchPlayedEpisodes: channelId => dispatch(fetchPlayedEpisodes(channelId)),
    addPlayedEpisode: (episode, channelId) => dispatch(addPlayedEpisode(episode, channelId)),
    //fetchRecommendedEpisodes: (channelId) => dispatch(fetchRecommendedEpisodes(channelId)),
    setSinglePodcast: episode => dispatch(setSinglePodcast(episode))
    // setPodcastList: episodes => dispatch(setPodcastList(episodes))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleChannel)
);
