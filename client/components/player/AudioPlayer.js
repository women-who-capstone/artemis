import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import axios from "axios";

let episodeAudio = document.createElement("audio");
class AudioPlayer extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      audioLength: 0,
      audioTimeElapsed: 0,
      episode: {}
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.skip = this.skip.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.bookmark = this.bookmark.bind(this);
  }

  async componentDidMount() {
    try {
      episodeAudio.src = await this.props.audio;
      episodeAudio.preload = "metadata";

      episodeAudio.addEventListener("loadedmetadata", () => {
        this.setState({
          audioLength: episodeAudio.duration
        });
      });
      episodeAudio.addEventListener('timeupdate', () => {
        if ((episodeAudio.duration - episodeAudio.currentTime) < 300) {

        }
      })
    } catch (error) {
      throw new Error("There was an audio error");
    }
  }

  handleSliderChange(event) {
    this.setState({
      audioTimeElapsed: event.target.value
    });
    episodeAudio.currentTime = this.state.audioTimeElapsed;

    if (this.state.audioTimeElapsed === this.state.audioLength) {
      //handle end of episode
    }
  }

  play() {
    episodeAudio.play();
    this.setState({
      isPlaying: true
    });
  }

  pause() {
    episodeAudio.pause();
    this.setState({
      isPlaying: false
    });
  }

  skip() {
    this.pause()
    this.props.handleSkip()
  }

  async bookmark() {
    let episode = this.props.episode;
    await axios.post("/api/bookmarks", { episodeId: episode.id });
  }

  render() {
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
          <ThumbUpIcon />
        </IconButton>
        <IconButton>
          <ThumbDownIcon />
        </IconButton>
        <IconButton>
          <BookmarkIcon onClick={this.bookmark} />
        </IconButton>
        <input
          type="range"
          value={this.state.audioTimeElapsed}
          aria-labelledby="label"
          onChange={this.handleSliderChange}
          min={0}
          max={this.state.audioLength}
          step="any"
        />
      </div>
    );
  }
}

export default AudioPlayer;
