import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import CardActions from '@material-ui/core/CardActions'
import PlayPause from './PlayPause'
import {
  Media,
  Player,
  controls,
  utils,
  withMediaProps
} from 'react-media-player'
const {
  MuteUnmute,
  CurrentTime,
  Progress,
  SeekBar,
  Duration,
  Volume,
  Fullscreen
} = controls
import episode from './tempEpisode.js'

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
    maxWidth: 400
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 400,
    height: 400
  },
  play: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  like: {
    display: 'flex',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    alignItems: 'center'
  },
  actions: {
    width: '90%'
  },
  playerMenu: {
    width: '100%',
    display: 'flex'
  },
  seekBar: {
    width: '100%'
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
                crossOrigin="anonymous"
                src={episode.audio}
                useAudioObject
              />
              <div className="media-controls">
                <PlayPause />
                <CurrentTime className="media-control media-control--current-time" />
                <SeekBar className="media-control media-control--volume-range" />
                <Duration className="media-control media-control--duration" />
                <MuteUnmute className="media-control media-control--mute-unmute" />
                <Volume className="media-control media-control--volume" />
              </div>
            </div>
          </Media>
        </CardActions>
      </Card>
      /* <Card className={classes.card}>
         <audio 
           id="episode"
           controls
         src="http://downloads.newyorker.com/mp3/comment/20161226_comment.mp3"
         >
           Your browser does not support the <code>audio</code> element.
         </audio>
       </Card>*/
    )
  }
}

export default withStyles(styles, { withTheme: true })(PodcastPlayer)
