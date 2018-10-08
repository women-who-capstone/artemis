import React from 'react';
import axios from 'axios';
import BookmarkItem from './BookmarkItem';
import List from '@material-ui/core/List';

class Bookmark extends React.Component {
	constructor() {
		super();
		this.state = {
			bookmarks: []
		};
	}

	async componentDidMount() {
		console.log('hi');
		let res = await axios.get(`/api/bookmarks`);
		let bookmarkEpisodes = res.data;
		console.log('HERE', bookmarkEpisodes);
		this.setState({
			bookmarks: bookmarkEpisodes
		});
	}
	render() {
		const bookmarks = this.state.bookmarks;
		return (
			<List>
				{bookmarks.length ? (
					bookmarks.map((bookmark) => <BookmarkItem key={bookmark.id} episode={bookmark} />)
				) : (
					<div />
				)}
			</List>
		);
	}
}

export default Bookmark;
