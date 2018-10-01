import React, { Component } from 'react';
import { connect } from "react-redux";
import ChannelListItem from './ChannelListItem'
import List from "@material-ui/core/List";
import { fetchUserChannels } from '../reducers/channel'

class ChannelList extends Component {
  componentDidMount() {
    this.props.fetchUserChannels(this.props.userId)
  }

  render() {
    const { channels } = this.props
    return (
      <div>
        <List>
          {channels.map(channel => <ChannelListItem key={channel.id} channel={channel} />)}
        </List>
      </div>
    );
  }
}

const mapState = state => {
  return {
    channels: state.channels.userChannels,
    userId: state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    fetchUserChannels: (userId) => dispatch(fetchUserChannels(userId))
  }
}

export default connect(mapState, mapDispatch)(ChannelList)
