import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import AudioPlayer from './player/AudioPlayer';

const styles = (theme) => ({
	card: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: 'auto',
		height: '80%'
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	cover: {
		display: 'flex',
		alignItems: 'center',
		width: 'auto',
		height: 300,
		maxWidth: '400px'
	},
	actions: {
		display: 'block'
	}
});

class BookmarkPlayer extends Component {
	render() {
		const { classes } = this.props;
		const episode = this.props.location.state.episode;

		return (
			<div>
				<Card className={`${classes.card} `}>
					<CardMedia
						className={classes.cover}
						image={episode.image ? episode.image : episode.imageURL}
						title={episode.title}
					/>
					<CardContent className={classes.content}>
						<Typography variant="headline">{episode.title}</Typography>
						<Typography variant="subheading" color="textSecondary">
							{episode.title}
						</Typography>
					</CardContent>
					<CardActions className={classes.actions}>
						<AudioPlayer
							audio={episode.audio ? episode.audio : episode.audioURL}
							episode={episode}
							setNewEpisode={this.props.setNewEpisode}
							tags={this.props.tags}
						/>
					</CardActions>
				</Card>
			</div>
		);
	}
	x;
}

export default withStyles(styles, { withTheme: true })(BookmarkPlayer);
