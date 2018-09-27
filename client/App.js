import React, { Component } from 'react'
import PodcastPlayer from './components/PodcastPlayer'
import AuthForm from './components/AuthForm'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <AuthForm />
        </div>
      </div>
    )
  }
}

export default App
