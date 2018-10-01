import React, { Component } from "react";
import PodcastPlayer from "./components";
import { Login, Signup, Logout } from "./components";
import Routes from "./routes";
import Button from "@material-ui/core/Button";
import NavBar from "./components/NavBar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Routes />
      </div>
    );
  }
}

export default App;
