import React from "react";
import PodcastPlayer from "./player/PodcastPlayer";
import { connect } from "react-redux";
import axios from "axios";
import { setSinglePodcast } from "../reducers/podcast";

class SingleChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      episode: {},
      tags: [],
      vector: []
    };
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
    let req = await axios.post("/api/episode", episode);
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
    const episodeId = await this.props.episodeId;
    if (episodeId !== undefined) {
      this.setEpisode(episodeId);
      //this.setTags()
    } else {
      let res = await axios.get(
        `/api/channel?id=${this.props.match.params.channelId}`
      );
      let playedEpisodes = res.data[0].episodes;
      // console.log(playedEpisodes);
      let episodeDates = playedEpisodes.map(episode =>
        new Date(episode.date).getTime()
      );
      let currentEpisodeDate = Math.max(...episodeDates);
      let currentEpisode = playedEpisodes.find(
        episode => new Date(episode.date).getTime() === currentEpisodeDate
      );
      this.setState({
        episode: currentEpisode
      });
    }
  }

  render() {
    if (this.state.episode.audio || this.state.episode.audioURL) {
      return (
        <PodcastPlayer
          episode={this.state.episode}
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
    episodeId: state.podcast.podcast.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSinglePodcast: episode => dispatch(setSinglePodcast(episode))
    // setPodcastList: episodes => dispatch(setPodcastList(episodes))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleChannel);
