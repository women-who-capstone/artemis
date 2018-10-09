import React, { Component } from 'react';
import PodcastPlayer from './components/player/PodcastPlayer';
import Routes from './routes';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<CssBaseline />
				<div className="App">
					<NavBar />
					{/* <Routes /> */}
				</div>
			</React.Fragment>
		);
	}
}

export default App;
