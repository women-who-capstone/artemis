import React from "react";
import {withRouter} from "react-router";
import PodcastPlayer from "./player/PodcastPlayer";
import {connect} from "react-redux";
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
import Loading from "./Loading";

class SingleChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      episode: {},
      unfinishedEpisode: {},
      episodeQueue: [],
      tags: [],
      vector: []
    };
    this.getEpisodeFromQueue = this.getEpisodeFromQueue.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleEpisodeEnd = this.handleEpisodeEnd.bind(this);
    this.addNewEpisodeToQueue = this.addNewEpisodeToQueue.bind(this);

    //this.setEpisode = this.setEpisode.bind(this);
    this.setTags = this.setTags.bind(this);
    //this.setNewEpisode = this.setNewEpisode.bind(this);
  }

  // setEpisode = async function(episodeId) {
  //   const channelId = this.props.match.params.channelId;
  //   const res = await axios.get(`/api/episode/apiEpisode?id=${episodeId}`);
  //   const podcastTitle = res.data.title;
  //   const podcastImage = res.data.image;
  //   const episode = res.data.episodes[0];
  //   episode.channelId = channelId;
  //   episode.podcastTitle = podcastTitle;
  //   episode.podcastImageURL = podcastImage;

  //   let req = await axios.post('/api/episode', episode);
  //   let newEpisode = req.data;
  //   this.setState({
  //     episode: newEpisode
  //   });
  //   this.setTags(newEpisode);
  //   this.props.setSinglePodcast({});
  // };

  // setNewEpisode = async function(episode) {
  //   let episodeId = episode.id;
  //   let channelId = this.props.match.params.channelId;
  //   // await axios.post("/api/episode/nextEpisode", {
  //   //   episodeId,
  //   //   channelId
  //   // });
  //   this.setState({
  //     episode
  //   });
  //   await axios.post('/api/episode/nextEpisode', {
  //     episodeId,
  //     channelId
  //   });
  //   this.setTags(episode);
  //   this.props.setSinglePodcast({});
  // };

  setTags = async function(episode) {
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
  };

  async componentDidMount() {
    const {channelId} = this.props.match.params;
    await this.getGenrePodcasts();
    await this.props.fetchPlayedEpisodes(channelId);
    await this.props.fetchRecommendedEpisodes(channelId);

    const mostRecentlyPlayedEpisode = this.extractMostRecentlyPlayedEpisode();
    this.setState({
      mostRecentlyPlayedEpisode
    });

    const episodeQueue = this.getEpisodeQueue(5);
    this.setState({
      episodeQueue
    });

    const newEpisode = this.getEpisodeFromQueue();
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    await this.props.addPlayedEpisode(newEpisode, channelId);
  }

  async getGenrePodcasts() {
    const {data: channel} = await axios.get(
      `/api/channel/${this.props.match.params.channelId}`
    );
    const genreId = getGenreIdFromGenreName(channel.name, genres);
    const {data: podcastsWithoutData} = await axios.get(
      `/api/podcast?id=${genreId}`
    );

    await this.props.fetchCategoryPodcastsEpisodeData(
      podcastsWithoutData.channels
    );
  }

  extractMostRecentlyPlayedEpisode() {
    let episodes = Object.keys(this.props.playedEpisodes).map(key => {
      return this.props.playedEpisodes[key];
    });

    let episodeDates = episodes.map(episode =>
      new Date(episode.date).getTime()
    );

    let currentEpisodeDate = Math.min(...episodeDates);
    let currentEpisode = episodes.find(
      episode => new Date(episode.date).getTime() === currentEpisodeDate
    );
    return currentEpisode;
  }

  async getNewEpisodeFromRecommendedEpisodes() {
    const channelId = this.props.match.params.channelId;
    let episode = await this.props.fetchRecommendedEpisodes(channelId);
    console.log("REC EP", episode);
    return episode;
  }

  getNewEpisodeFromCategoryPodcast() {
    const {bestCategoryPodcasts} = this.props;
    let counter = 0;
    let podcastIndex, podcast, episodeIndex, episode;

    while (!this.episodeHasNotBeenPlayed(episode)) {
      podcastIndex = getRandomIndex(bestCategoryPodcasts.length);
      podcast = bestCategoryPodcasts[podcastIndex];

      episodeIndex = getRandomIndex(podcast.episodes.length);
      episode = podcast.episodes[episodeIndex];
      episode.podcastTitle = podcast.title;
      episode.podcastImageURL = podcast.image;

      counter++;
      if (counter > 50) {
        this.getGenrePodcasts();
        return episode;
      }
    }
    return episode;
  }

  episodeHasNotBeenPlayed(episode) {
    if (episode === undefined) {
      return false;
    }

    if (this.props.playedEpisodes[episode.title] !== undefined) {
      return false;
    }

    return true;
  }

  getNewEpisode() {
    let newEpisode;
    if (!this.props.recommendedEpisode) {
      newEpisode = this.getNewEpisodeFromCategoryPodcast();
    } else {
      // gets new recommended episodes
      newEpisode = this.getNewEpisodeFromRecommendedEpisodes();
    }
    return newEpisode;
  }

  getEpisodeQueue(numDesiredEpisodes) {
    const queue = [];

    let newEpisode;
    const mostRecentlyPlayedEpisode = this.state.mostRecentlyPlayedEpisode;

    if (mostRecentlyPlayedEpisode) {
      queue.push(this.state.mostRecentlyPlayedEpisode);
    }
    const hasSameTitle = episode => episode.title === newEpisode.title;

    while (queue.length < numDesiredEpisodes) {
      newEpisode = this.getNewEpisode();
      let sameTitles = queue.filter(hasSameTitle);
      if (sameTitles.length === 0) {
        queue.push(this.getNewEpisode());
      }
    }

    return queue;
  }

  addNewEpisodeToQueue() {
    let newEpisode = this.getNewEpisode();
    const hasSameTitle = episode => episode.title === newEpisode.title;
    while (this.state.episodeQueue.filter(hasSameTitle).length > 0) {
      newEpisode = this.getNewEpisode();
    }
    this.setState({
      episodeQueue: [...this.state.episodeQueue, newEpisode]
    });
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
    //const episodeThatJustEnded = this.state.episode;
    const channelId = this.props.match.params.channelId;

    //get new episode from queue
    const newEpisode = this.getEpisodeFromQueue();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue();
  }

  async handleSkip() {
    //add episode that was playing before skip to played episodes
    //const episodeSkipped = this.state.episode;
    const channelId = this.props.match.params.channelId;

    //get new episode
    const newEpisode = this.getEpisodeFromQueue();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue();
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
    if (this.props.loading) {
      return <Loading />;
    }
    if (this.state.episode.audio || this.state.episode.audioURL) {
      return (
        <PodcastPlayer
          episode={this.state.episode}
          episodeQueue={this.state.episodeQueue}
          handleSkip={this.handleSkip}
          handleEpisodeEnd={this.handleEpisodeEnd}
          channelId={this.props.match.params.channelId}
          setNewEpisode={this.setNewEpisode}
          tags={this.state.tags}
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
    episodeId: state.podcast.podcast.id,
    loading: state.podcast.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategoryPodcastsEpisodeData: podcasts =>
      dispatch(fetchCategoryPodcastsEpisodeData(podcasts)),
    fetchPlayedEpisodes: channelId => dispatch(fetchPlayedEpisodes(channelId)),
    addPlayedEpisode: (episode, channelId) =>
      dispatch(addPlayedEpisode(episode, channelId)),
    fetchRecommendedEpisodes: channelId =>
      dispatch(fetchRecommendedEpisodes(channelId)),
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
