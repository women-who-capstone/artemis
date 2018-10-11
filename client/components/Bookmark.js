import React from 'react';
import axios from 'axios';
import BookmarkItem from './BookmarkItem';
import {withStyles} from '@material-ui/core/styles';
import {GridList, Paper, Typography} from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    width: 500,
    height: 450
  },
  message: {
    ...theme.mixins.gutters(),
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%'
  },
  type: {
    fontSize: '1rem',
    padding: '4px 0',
    margin: 0
  }
});
class Bookmark extends React.Component {
  constructor() {
    super();
    this.state = {
      bookmarks: []
    };
  }

  async componentDidMount() {
    let res = await axios.get(`/api/bookmarks`);
    let bookmarkEpisodes = res.data;
    this.setState({
      bookmarks: bookmarkEpisodes
    });
  }
  render() {
    const bookmarks = this.state.bookmarks;

    const {classes} = this.props;
    return (
      <div className={classes.root}>
        {bookmarks.length > 0 ? (
          <GridList>
            bookmarks.map(bookmark => (
            <BookmarkItem key={bookmark.id} episode={bookmark} />
            ))
          </GridList>
        ) : (
          <Paper className={classes.message}>
            <Typography variant="body1" className={classes.type}>
              You don't have any bookmarks.
            </Typography>
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Bookmark);
