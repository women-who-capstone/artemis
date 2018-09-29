import React, { Component } from 'react'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import IconButton from '@material-ui/core/IconButton'
import { withMediaProps } from 'react-media-player'
class PlayPause extends Component {
  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying
  }

  _handlePlayPause = () => {
    this.props.media.playPause()
  }

  render() {
    const { className, style, media } = this.props
    return (
      <IconButton className={className} onClick={this._handlePlayPause}>
        {media.isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
    )
  }
}

export default withMediaProps(PlayPause)
