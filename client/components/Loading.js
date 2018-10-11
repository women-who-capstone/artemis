import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    height: "200px"
  }
});

const Loading = props => {
  const {classes} = props;
  return <CircularProgress className={classes.progress} color="secondary" />;
};

export default withStyles(styles)(Loading);
