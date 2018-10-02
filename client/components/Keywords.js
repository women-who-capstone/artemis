import React from 'react';
import axios from 'axios';

var input = [
	[
		'badger badger buffalo mushroom mushroom mushroom mushroom mushroom mushroom mushroom',
		'antelope buffalo mushroom',
		'bannana'
	],
	2
];

class Keywords extends React.Component {
	constructor() {
		super();
		this.state = {
			result: []
		};
	}
	async componentDidMount() {
		const res = await axios.get('/api/keywords', {
			params: {
				input: input
			}
		});
		const result = res.data;
		this.setState({
			result
		});
	}

	render() {
		return (
			<div>
				{this.state.result.map((element) => {
					console.log(element);
				})}
			</div>
		);
	}
}

export default Keywords;
