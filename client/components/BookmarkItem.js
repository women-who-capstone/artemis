import React from 'react';
import { Redirect } from 'react-router';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PodcastPlayer from './player/PodcastPlayer';

import axios from 'axios';

class BookmarkItem extends React.Component {
	constructor() {
		super();
		this.state = {
			singleEpisode: {},
			cliked: false
		};
		this.playBookmark = this.playBookmark.bind(this);
	}
	async componentDidMount() {
		let res = await axios.get(`/api/episode/${this.props.episode.episodeId}`);
		let singleEpisode = res.data;
		this.setState({
			singleEpisode: singleEpisode
		});
	}

	playBookmark() {
		this.setState({
			cliked: true
		});
	}
	render() {
		const singleEp = this.state.singleEpisode;
		if (this.state.cliked) {
			//return <PodcastPlayer episode={singleEp} />;
			return (
				<Redirect
					to={{
						pathname: '/bookmarkplayer',
						state: {
							episode: singleEp
						}
					}}
				/>
			);
		} else {
			return (
				<div onClick={this.playBookmark}>
					<ListItem>
						<ListItemText>{singleEp.title}</ListItemText>
					</ListItem>
					<img src={singleEp.imageURL} style={{ alignSelf: 'center' }} />
				</div>
			);
		}
	}
}

export default BookmarkItem;
