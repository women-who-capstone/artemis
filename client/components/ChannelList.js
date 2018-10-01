import React, { Component } from 'react';
import ChannelListItem from './ChannelListItem'
import List from "@material-ui/core/List";
  const channels = [
{
id: 1820,
name: "Comedy",
createdAt: "2018-10-01T19:26:34.373Z",
updatedAt: "2018-10-01T19:26:34.373Z",
userId: 1001
},
{
id: 1821,
name: "Food",
createdAt: "2018-10-01T19:57:38.494Z",
updatedAt: "2018-10-01T19:57:38.494Z",
userId: 1001
},
{
id: 1822,
name: "Music",
createdAt: "2018-10-01T19:59:31.610Z",
updatedAt: "2018-10-01T19:59:31.610Z",
userId: 1001
}
]

class ChannelList extends Component {
  render() {
    return (
      <div>
        <List>
          {channels.map(channel => <ChannelListItem key={channel.id} channel={channel} />)}
        </List>
      </div>
    );
  }
}

export default ChannelList
