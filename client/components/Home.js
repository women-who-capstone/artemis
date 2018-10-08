import React, { Component } from 'react';

import { Login, Signup } from './AuthForm';

class Home extends Component {
	render() {
		return (
			<div className="homeDiv">
				<Login />
				<Signup />
			</div>
		);
	}
}

export default Home;
