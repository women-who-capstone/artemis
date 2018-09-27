import React, { Component } from 'react'
import PodcastPlayer from './components'
import { Login, Signup } from './components'
import Routes from './routes'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Routes />
      </div>
    )
  }
}

export default App
