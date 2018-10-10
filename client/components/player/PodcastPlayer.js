import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import AudioPlayer from "./AudioPlayer";
import SoundVolume from "./SoundVolume";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    minwidth: "400px",
    maxWidth: "60%",
    height: "100%"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    display: "flex",
    alignItems: "center",
    // width: "auto",
    height: 400,
    maxWidth: "400px"
  },
  actions: {
    display: "block"
  }
});

class PodcastPlayer extends Component {
  // constructor() {
  //   super()
  //   let episodeAudio = new Audio()
  //   episodeAudio.src = ''
  //   episodeAudio.preload = 'metadata'

  //   this.state = {
  //     episodeAudio: episodeAudio,
  //     currentTime: episodeAudio.currentTime,
  //     audioLength: 0
  //   }
  // }

  componentDidMount() {
    // const { episode } = this.props;
    // let episodeAudioCopy = this.state.episodeAudio
    // console.log('episodeAudioCopy', episodeAudioCopy)
    // episodeAudioCopy.src = episode.audio ? episode.audio : episode.audioURL
    // episodeAudioCopy.load()
    // episodeAudioCopy.addEventListener('loadedmetadata', () => {
    //   this.setState({
    //     audioLength: episodeAudioCopy.duration
    //   });
    // })

    // episodeAudioCopy.addEventListener('timeupdate', () => {
    //   this.setState({
    //     currentTime: episodeAudioCopy.currentTime
    //   });
    // })

    // this.setState({
    //   episodeAudio: episodeAudioCopy
    // })
  }

  componentDidUpdate(prevProps) {
    // if (this.props.episode !== prevProps.episode) {
    //   const { episode } = this.props;
    //   let episodeAudioCopy = this.state.episodeAudio
    //   console.log('episodeAudioCopy', episodeAudioCopy)
    //   episodeAudioCopy.src = episode.audio ? episode.audio : episode.audioURL
    //   episodeAudioCopy.load()
    //   episodeAudioCopy.addEventListener('loadedmetadata', () => {
    //     this.setState({
    //       audioLength: episodeAudioCopy.duration
    //     });
    //   })

    //   episodeAudioCopy.addEventListener('timeupdate', () => {
    //     this.setState({
    //       currentTime: episodeAudioCopy.currentTime
    //     });
    //   })

    //   this.setState({
    //     episodeAudio: episodeAudioCopy
    //   })
    // }
  }

  render() {
    // const { value } = this.state
    const {
      classes,
      handleEpisodeEnd,
      episodeQueue,
      handleSkip,
      episode,
      channelId
    } = this.props;

    // this.state.episodeAudio.src = episode.audio ? episode.audio : episode.audioURL
    // this.state.episodeAudio.preload = 'auto';
    // this.state.episodeAudio.load()

    // this.state.episodeAudio.addEventListener('loadedmetadata', () => {
    //   audioLength = this.state.episodeAudio.duration
    // });

    // this.state.episodeAudio.addEventListener('timeupdate', () => {
    //   currentTime = this.state.episodeAudio.currentTime
    // });

    return (
      <div>
        <Card className={`${classes.card} `}>
          <CardMedia
            style={{
              margin: "0px 0px 0px 0px"
            }}
            className={classes.cover}
            image={
              episode.imageURL ? episode.imageURL : episode.podcastImageURL
            }
            title={episode.title}
          />
          <CardContent className={classes.content}>
            <Typography variant="headline">{episode.title}</Typography>
            <Typography variant="subheading" color="textSecondary">
              {episode.podcastTitle}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <AudioPlayer
              audio={episode.audio ? episode.audio : episode.audioURL}
              episode={episode}
              channelId={channelId}
              episodeQueue={episodeQueue}
              handleSkip={handleSkip}
              handleEpisodeEnd={handleEpisodeEnd}
              tags={this.props.tags}
              /*episodeAudio={this.state.episodeAudio}
              audioLength={this.state.audioLength}
              currentTime={this.state.currentTime}*/
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PodcastPlayer);
