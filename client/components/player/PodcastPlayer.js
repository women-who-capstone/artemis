import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import CardActions from '@material-ui/core/CardActions'
import PlayPause from './PlayPause'
import MuteUnmute from './MuteUnmute'
import {
  Media,
  Player,
  controls,
  utils,
  withMediaProps
} from 'react-media-player'

const {
  CurrentTime,
  Progress,
  SeekBar,
  Duration,
  Volume,
  Fullscreen
} = controls
import episode from '../tempEpisode' //TEMP

const { formatTime } = utils

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const panner = audioContext.createPanner()

panner.setPosition(0, 0, 1)
panner.panningModel = 'equalpower'
panner.connect(audioContext.destination)

const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 640
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: '100%',
    height: 320
  }
})

class PodcastPlayer extends Component {
  componentDidMount() {
    const source = audioContext.createMediaElementSource(this._player.instance)
    source.connect(panner)
    panner.connect(audioContext.destination)
  }

  render() {
    // const { value } = this.state
    const { classes } = this.props

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cover}
          image={episode.image ? episode.image : episode.podcast.image}
          title={episode.title}
        />
        <CardContent className={classes.content}>
          <Typography variant="headline">{episode.title}</Typography>
          <Typography variant="subheading" color="textSecondary">
            {episode.podcast.title}
          </Typography>
        </CardContent>

        <CardActions className={classes.actions}>
          <Media>
            <div>
              <Player
                ref={c => (this._player = c)}
                src={episode.audio}
                crossOrigin="anonymous"
                useAudioObject
              />
              <div className="media-controls">
                <PlayPause className="media-control media-control--play-pause" />
                <Typography>
                  <CurrentTime className="media-control media-control--current-time" />
                </Typography>
                <SeekBar className="media-control media-control--volume-range" />
                <Typography>
                  <Duration className="media-control media-control--duration" />
                </Typography>
                <MuteUnmute className="media-control media-control--mute-unmute" />
                <Volume className="media-control media-control--volume" />
              </div>
            </div>
          </Media>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PodcastPlayer)
