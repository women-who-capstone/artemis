import React from 'react';
import ListItem from "@material-ui/core/ListItem"
import ListItemText from '@material-ui/core/ListItemText'

const ChannelListItem = (props) => {
  const { id, name, handleChannelListClick } = props
  return (
    <div>
      <ListItem button onClick={handleChannelListClick}>
        <ListItemText>
          {name}
        </ListItemText>
      </ListItem>
    </div>
  )
}

export default ChannelListItem
