import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
// import CardMedia from '@material-ui/core/CardMedia'
// import IconButton from '@material-ui/core/IconButton'
// import Typography from '@material-ui/core/Typography'
// import PlayArrowIcon from '@material-ui/icons/PlayArrow'
// import SkipNextIcon from '@material-ui/icons/SkipNext'

const styles = theme => ({
  card: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 151,
    height: 151
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  }
})

function PodcastPlayer(props) {
  const { classes, theme } = props

  return (
    <Card className={classes.card}>
      <audio
        id="episode"
        controls
        src="http://downloads.newyorker.com/mp3/comment/20161226_comment.mp3"
      >
        Your browser does not support the <code>audio</code> element.
      </audio>
    </Card>
  )
}

export default withStyles(styles, { withTheme: true })(PodcastPlayer)
