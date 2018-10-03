import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

let episodeAudio = document.createElement('audio')
class AudioPlayer extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      audioLength: 0,
      audioTimeElapsed: 0,
      audioHasEnded: false
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  componentDidMount() {
    episodeAudio.src = this.props.audio
  }

  play() {
    episodeAudio.play();
    this.setState({
      isPlaying: true
    });
  }

  async pause() {
    console.log('episodeAudio')
    await episodeAudio.pause();
    this.setState({
      isPlaying: false
    });
  }

  render() {
    return (
      <div>
        <IconButton>
          <PlayArrowIcon onClick={this.play} />
        </IconButton>
        <IconButton>
          <PauseIcon onClick={this.pause} />
        </IconButton>
      </div>
    );
  }
}

export default AudioPlayer;
