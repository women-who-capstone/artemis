import React, { Component } from "react";
import PodcastPlayer from "./components";
import { Login, Signup, Logout } from "./components";
import Routes from "./routes";
import Button from "@material-ui/core/Button";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
          <Logout />
        </header>
        <Routes />
      </div>
    );
  }
}

export default App;
