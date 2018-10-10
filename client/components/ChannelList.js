import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import ChannelListItem from './ChannelListItem';
import { List, Paper } from '@material-ui/core';
import { fetchUserChannels } from '../reducers/channel';
import history from '../history';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list: {
    backgroundColor: 'rgba(255,255,255,0.5)'
  }
});

class ChannelList extends Component {
  constructor() {
    super();
    this.state = {
      differentChannelSelected: false,
      channelId: ''
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(channelId) {
    history.push(`/channel/${channelId}`);
  }

  componentDidMount() {
    this.props.fetchUserChannels(this.props.userId);
  }

  render() {
    const { channels, classes } = this.props;
    // return this.state.differentChannelSelected ? (
    //   <Redirect to={`/channel/${this.state.channelId}`} />
    // ) : (
    return (
      <Paper className={classes.list}>
        <List>
          {channels.map(channel => (
            <ChannelListItem
              key={channel.id}
              channel={channel}
              handleClick={() => this.handleClick(channel.id)}
            />
          ))}
        </List>
      </Paper>
    );
  }
}

const mapState = state => {
  return {
    channels: state.channels.userChannels,
    userId: state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    fetchUserChannels: userId => dispatch(fetchUserChannels(userId))
  };
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(ChannelList)
);
