import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import axios from 'axios';

class BookmarkItem extends React.Component {
	constructor() {
		super();
		this.state = {
			singleEpisode: {}
		};
	}
	async componentDidMount() {
		let res = await axios.get(`/api/episode/${this.props.episode.episodeId}`);
		let singleEpisode = res.data;
		this.setState({
			singleEpisode
		});
	}
	render() {
		const episode = this.props.episode;
		const singleEp = this.state.singleEpisode;
		console.log('EPICODE', episode);
		return (
			<div>
				<ListItem>
					<ListItemText>{singleEp.title}</ListItemText>
				</ListItem>
				<img src={singleEp.imageURL} style={{ alignSelf: 'center' }} />
			</div>
		);
	}
}

export default BookmarkItem;
