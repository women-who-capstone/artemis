import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const ChannelListItem = props => {
  const { id, name } = props.channel;
  return (
    <div>
      <ListItem button>
        <ListItemText>{name}</ListItemText>
      </ListItem>
    </div>
  );
};

export default ChannelListItem;
