import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const BookmarkItem = props => {
  const episode = props.episode;
  return (
    <div>
      <ListItem>
        <ListItemText>episode</ListItemText>
      </ListItem>
    </div>
  );
};

export default BookmarkItem;
