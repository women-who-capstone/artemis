import React from 'react';
import {Redirect} from 'react-router';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

const styles = theme => ({
  bookmarkTitle: {
    backgroundColor: 'rgba(115, 153, 158, 0.8)'
  },
  bookmark: {
    margin: 8
  }
});

class BookmarkItem extends React.Component {
  constructor() {
    super();
    this.state = {
      singleEpisode: {},
      cliked: false
    };
    this.playBookmark = this.playBookmark.bind(this);
  }
  async componentDidMount() {
    let res = await axios.get(`/api/episode/${this.props.episode.episodeId}`);
    let singleEpisode = res.data;
    this.setState({
      singleEpisode: singleEpisode
    });
  }

  playBookmark() {
    this.setState({
      cliked: true
    });
  }
  render() {
    const {classes} = this.props;
    const singleEp = this.state.singleEpisode;

    if (this.state.cliked) {
      return (
        <Redirect
          to={{
            pathname: '/bookmarkplayer',
            state: {
              episode: singleEp
            }
          }}
        />
      );
    } else {
      return (
        <div onClick={this.playBookmark}>
          <div className={classes.root}>
            <Grid container spacing={8}>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <ListItem>
                    <ListItemText>{singleEp.title}</ListItemText>
                  </ListItem>
                  <img src={singleEp.imageURL} style={{alignSelf: 'center'}} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      );
    }
  }
}

export default withStyles(styles)(BookmarkItem);
