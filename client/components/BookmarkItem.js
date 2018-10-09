import React from 'react';
import {
  GridListTile,
  GridListTileBar,
  IconButton,
  ButtonBase,
  withStyles
} from '@material-ui/core/';

import axios from 'axios';

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
      singleEpisode: {}
    };
  }
  async componentDidMount() {
    let res = await axios.get(`/api/episode/${this.props.episode.episodeId}`);
    let singleEpisode = res.data;
    this.setState({
      singleEpisode
    });
  }
  render() {
    const episode = this.props.episode;
    const singleEp = this.state.singleEpisode;
    const { classes } = this.props;
    return (
      <ButtonBase focusRipple className={classes.bookmark}>
        <GridListTile>
          <img
            src={
              singleEp.imageURL ? singleEp.imageURL : singleEp.podcastImageURL
            }
            alt={singleEp.title}
          />
          <GridListTileBar
            className={classes.bookmarkTitle}
            title={singleEp.title}
            subtitle={<span>{singleEp.podcastTitle}</span>}
          />
        </GridListTile>
      </ButtonBase>
      // <ListItem>
      //   <img src={singleEp.imageURL} style={{ alignSelf: 'center' }} />
      //   <ListItemText>{singleEp.title}</ListItemText>
      // </ListItem>
    );
  }
}

export default withStyles(styles)(BookmarkItem);
