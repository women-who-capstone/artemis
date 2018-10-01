import React, { Component } from 'react'
import PodcastPlayer from './components/PodcastPlayer'
import CssBaseline from '@material-ui/core/CssBaseline'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <PodcastPlayer />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App
