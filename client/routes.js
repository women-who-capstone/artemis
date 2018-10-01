import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import PodcastPlayer from "./components/PodcastPlayer";
import CreateChannel from "./components/CreateChannel";
import Channel from "./components/Channel";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/podcastplayer" component={PodcastPlayer} />
        <Route path="/createchannel" component={CreateChannel} />
        <Route exact path="/channel/:channelId" component={Channel} />
      </Switch>
    );
  }
}

export default Routes;
