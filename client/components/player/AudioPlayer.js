import React, { Component } from "react";
import { updateActiveChannelTags } from "../../reducers/channel";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Bookmark from "@material-ui/icons/Bookmark";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import axios from "axios";
import SoundVolume from "./SoundVolume";
//let episodeAudio = document.createElement('audio');

class AudioPlayer extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      unmute: true,
      audioLength: 0,
      audioTimeElapsed: 0,
      audioVolume: 0.5,
      isBookmark: false,
      liked: false,
      disliked: false
    };

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.skip = this.skip.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.bookmark = this.bookmark.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    try {
      this.props.episodeAudio.addEventListener("loadedmetadata", () => {
        this.setState({
          audioLength: this.props.episodeAudio.duration
        });
      });
      this.props.episodeAudio.addEventListener("ended", () => {
        console.log("episode ended");
        this.props.handleEpisodeEnd();
        this.setState({
          isBookmark: false,
          isPlaying: false
        });
      });
      this.props.episodeAudio.addEventListener("error", () => {
        this.props.handleEpisodeEnd();
      });

      this.props.episodeAudio.addEventListener("timeupdate", () => {
        this.setState({
          audioTimeElapsed: this.props.episodeAudio.currentTime
        });
      });
    } catch (error) {
      throw new Error("There was an audio error");
    }
  }

  componentWillUnmount() {
    this.props.episodeAudio.removeEventListener("loadedmetadata", () => {
      this.setState({
        audioLength: this.props.episodeAudio.duration
      });
    });
    this.props.episodeAudio.removeEventListener("ended", () => {
      this.props.handleEpisodeEnd();
    });
    this.props.episodeAudio.removeEventListener("error", () => {
      this.props.handleEpisodeEnd();
    });
    this.props.episodeAudio.removeEventListener("timeupdate", () => {
      this.setState({
        audioTimeElapsed: this.props.episodeAudio.currentTime
      });
    });
  }

  handleSliderChange(event) {
    // this.setState({
    // 	audioTimeElapsed: Number(event.target.value)
    // });
    this.props.episodeAudio.currentTime = Number(event.target.value);
  }

  handleVolumeChange(event) {
    this.setState({
      audioVolume: event.target.value
    });

    this.props.episodeAudio.volume = this.state.audioVolume;
  }

  play() {
    this.props.episodeAudio.play();
    this.setState({
      isPlaying: true
    });
  }

  pause() {
    this.props.episodeAudio.pause();
    this.setState({
      isPlaying: false
    });
  }

  handleMute() {
    var stateUnmute = this.state.unmute;
    if (stateUnmute) {
      this.setState({
        audioVolume: 0,
        unmute: !stateUnmute
      });
      this.props.episodeAudio.muted = true;
    } else {
      this.setState({
        audioVolume: 0.1,
        unmute: !stateUnmute
      });
      this.props.episodeAudio.muted = false;
    }
  }

  skip() {
    //this.pause();
    this.props.handleSkip();
    this.setState({
      isBookmark: false,
      isPlaying: false
    });

    // this.props.episodeAudio.src = this.props.audio;
    // this.props.episodeAudio.load()
  }

  async bookmark() {
    let apiEpisode = this.props.episode;
    let databaseEpisode = this.props.databaseEpisodes[apiEpisode.title];
    console.log("databaseEpisode sfdsfd", databaseEpisode);
    let bookMarked = this.state.isBookmark;
    await axios.post("/api/bookmarks", { id: databaseEpisode.id }); //FIX use Redux
    this.setState({ isBookmark: !bookMarked });
  }

  like() {
    let isLiked = this.state.liked;
    let episode = this.props.episode;
    let epTags = this.props.tags;
    this.props.updatedActiveChannelTags(
      episode.channelId,
      "like",
      epTags,
      episode
    );
    this.setState({
      liked: !isLiked,
      disliked: false
    });
  }

  dislike() {
    let isDisliked = this.state.disliked;
    let episode = this.props.episode;
    let epTags = this.props.tags;
    this.props.updatedActiveChannelTags(
      episode.channelId,
      "dislike",
      epTags,
      episode
    );
    this.setState({
      disliked: !isDisliked,
      liked: false
    });
  }

  // async bookmark() {
  //   let episode = this.props.episode;
  //   let bookMarked = this.state.isBookmark;
  //   await axios.post("/api/bookmarks", { episodeId: episode.id }); //FIX use Redux
  //   this.setState({ isBookmark: !bookMarked });
  // }

  async next() {
    let channelId = this.props.channelId;
    let res = await axios.get("/api/episode/next", {
      params: {
        channelId: channelId
      }
    });
    let nextEpisode = res.data;
    this.props.setNewEpisode(nextEpisode);
  }

  currentTimeCalculation() {
    let timeInMin = Math.floor(
      this.props.episodeAudio.currentTime / 60
    ).toString();
    let timeInSec = Math.floor(
      this.props.episodeAudio.currentTime % 60
    ).toString();
    if (timeInMin < 10) {
      timeInMin = "0" + timeInMin;
    }
    if (timeInSec < 10) {
      timeInSec = "0" + timeInSec;
    }
    let currentTimeInStr = timeInMin + ":" + timeInSec;
    return currentTimeInStr;
  }

  render() {
    const currentTimeInString = this.currentTimeCalculation();
    const durationInMin = parseInt(this.props.episodeAudio.duration / 60, 10);
    const durationInSec = parseInt(this.props.episodeAudio.duration % 60);
    console.log("episodeAudio", this.props.episodeAudio);
    //episodeAudio.src = this.props.audio;

    return (
      <div>
        {this.state.isPlaying ? (
          <IconButton>
            <PauseIcon onClick={this.pause} />
          </IconButton>
        ) : (
          <IconButton>
            <PlayArrowIcon onClick={this.play} />
          </IconButton>
        )}
        <IconButton onClick={this.skip}>
          <SkipNextIcon />
        </IconButton>
        <IconButton>
          <ThumbUpIcon
            onClick={this.like}
            className={this.state.liked ? "material-icons orange600" : "empty"}
          />
        </IconButton>
        <IconButton>
          <ThumbDownIcon
            onClick={this.dislike}
            className={
              this.state.disliked ? "material-icons orange600" : "empty"
            }
          />
        </IconButton>
        <IconButton>
          <Bookmark
            onClick={this.bookmark}
            className={
              this.state.isBookmark ? "material-icons orange600" : "empty"
            }
          />
        </IconButton>
        <IconButton>
          {this.state.unmute ? (
            <VolumeUp onClick={this.handleMute} />
          ) : (
            <VolumeOff onClick={this.handleMute} />
          )}
        </IconButton>

        <SoundVolume
          handleVolumeChange={this.handleVolumeChange}
          audioVolume={this.state.audioVolume}
        />

        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: "35" }}>
            <input
              type="range"
              value={this.props.currentTime}
              aria-labelledby="label"
              onChange={this.handleSliderChange}
              min={0}
              max={this.props.audioLength}
              step="any"
            />
          </div>
          {durationInMin && durationInSec ? (
            <div style={{ float: "right", flexGrow: "1" }}>
              {currentTimeInString} | {durationInMin}:{durationInSec}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    databaseEpisodes: state.podcast.playedEpisodes
  };
};
//mapStateToProps()
const mapDispatchToProps = dispatch => {
  return {
    updatedActiveChannelTags: (channelId, method, tags, episode) =>
      dispatch(updateActiveChannelTags(channelId, method, tags, episode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);
