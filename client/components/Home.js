import React, { Component } from 'react';

import { Login } from './AuthForm';

class Home extends Component {
	render() {
		return (
			<div className="homeDiv">
				<Login />
			</div>
		);
	}
}

export default Home;
