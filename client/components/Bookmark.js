import React from 'react';
import axios from 'axios';
import BookmarkItem from './BookmarkItem';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';

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
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
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
        <GridList>
          {bookmarks.length
            ? bookmarks.map(bookmark => (
                <BookmarkItem key={bookmark.id} episode={bookmark} />
              ))
            : ''}
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(Bookmark);
