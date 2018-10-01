import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const ChannelListItem = props => {
  const { id, name, handleClick } = props.channel;
  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText>{name}</ListItemText>
      </ListItem>
    </div>
  );
};

export default ChannelListItem;
