import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import axios from 'axios';
import { updateActiveChannelTags } from '../../reducers/channel';
import { connect } from 'react-redux';

let episodeAudio = document.createElement('audio');
class AudioPlayer extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      audioLength: 0,
      audioTimeElapsed: 0
      // episode: {}, // Redux
      // epTags: [],
      // chanTags: []
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.skip = this.skip.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.bookmark = this.bookmark.bind(this);
    this.next = this.next.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
  }

  componentDidMount() {
    // FIX shouldn't be async
    try {
      episodeAudio.src = this.props.audio;
      episodeAudio.preload = "metadata";

      episodeAudio.addEventListener("loadedmetadata", () => {
        this.setState({
          audioLength: episodeAudio.duration
        });
      });
      episodeAudio.addEventListener('ended', () => {
        this.props.handleEpisodeEnd()
      })
    } catch (error) {
      throw new Error('There was an audio error');
    }
  }

  componentWillUnmount() {
     episodeAudio.removeEventListener("loadedmetadata", () => {
        this.setState({
          audioLength: episodeAudio.duration
        });
      });
      episodeAudio.removeEventListener('ended', () => {
        this.props.handleEpisodeEnd()
      })
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
    await axios.post('/api/bookmarks', { episodeId: episode.id }); //FIX use Redux
  }

  like() {
    console.log(
      'from AudioPlayer component',
      this.props.channelId,
      typeof this.props.channelId
    );
    let episode = this.props.episode;
    let epTags = this.props.tags;
    console.log(episode, epTags);
    this.props.updatedActiveChannelTags(this.props.channelId, 'like', epTags);
    console.log(this.props);
  }

  dislike() {
    let episode = this.props.episode;
    let epTags = this.props.tags;
    this.props.updatedActiveChannelTags(
      episode.channelEpisode.channelId,
      'dislike',
      epTags
    );
  }

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
          <ThumbUpIcon onClick={this.like} />
        </IconButton>
        <IconButton>
          <ThumbDownIcon onClick={this.dislike} />
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

//mapStateToProps()
const mapDispatchToProps = dispatch => {
  return {
    updatedActiveChannelTags: (channelId, method, tags) =>
      dispatch(updateActiveChannelTags(channelId, method, tags))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(AudioPlayer);
