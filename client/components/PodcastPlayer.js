import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'
import CardActions from '@material-ui/core/CardActions'
import Slider from '@material-ui/lab/Slider'
import episode from './tempEpisode.js'

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
    display: 'flex',
    width: 400,
    justifyContent: 'space-between'
  },
  slider: {
    width: 380
  }
})

class PodcastPlayer extends Component {
  constructor() {
    super()
    this.state = {
      value: 0,
      playing: false,
      isFetching: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { value } = this.state
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
        <Slider
          value={value}
          aria-labelledby="label"
          onChange={this.handleChange}
          className={classes.slider}
        />
        <CardActions className={classes.actions}>
          <div className={classes.play}>
            <IconButton aria-label="Play/pause">
              <PlayArrowIcon className={classes.playIcon} />
            </IconButton>
            <IconButton aria-label="Next">
              <SkipNextIcon />
            </IconButton>
          </div>
          <div className={classes.like}>
            <IconButton aria-label="Play more like this">
              <ThumbUp />
            </IconButton>
            <IconButton aria-label="Don't play more like this">
              <ThumbDown />
            </IconButton>
          </div>
        </CardActions>
      </Card>
      // <Card className={classes.card}>
      //   <audio
      //     id="episode"
      //     controls
      //     src="http://downloads.newyorker.com/mp3/comment/20161226_comment.mp3"
      //   >
      //     Your browser does not support the <code>audio</code> element.
      //   </audio>
      // </Card>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PodcastPlayer)
