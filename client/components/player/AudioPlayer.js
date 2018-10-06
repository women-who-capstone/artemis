import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import axios from 'axios';
import SoundVolume from './SoundVolume';
let episodeAudio = document.createElement('audio');

const styles = {
	inputy: {
		width: '50%',
		right: '10%'
	},
	timer: { verticalAlign: 'baseline' }
};

class AudioPlayer extends Component {
	constructor() {
		super();
		this.state = {
			isPlaying: false,
			unmute: true,
			//added for time
			//audioCurrentTime: 0,
			audioLength: 0,
			audioTimeElapsed: 0,
			audioVolume: 0.5,
			episode: {}
		};
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.handleMute = this.handleMute.bind(this);
		this.handleSliderChange = this.handleSliderChange.bind(this);
		this.bookmark = this.bookmark.bind(this);
		this.handleVolumeChange = this.handleVolumeChange.bind(this);
	}

	async componentDidMount() {
		// console.log('this is currentTime', Number(episodeAudio.currentTime / 60).toFixed(2));
		try {
			episodeAudio.src = await this.props.audio;
			episodeAudio.preload = 'metadata';
			episodeAudio.addEventListener('loadedmetadata', () => {
				this.setState({
					audioLength: episodeAudio.duration
				});
			});
		} catch (error) {
			throw new Error('There was an audio error');
		}
	}

	handleSliderChange(event) {
		this.setState({
			audioTimeElapsed: event.target.value,
			//added for time
			audioCurrentTime: episodeAudio.currentTime
		});
		episodeAudio.currentTime = this.state.audioTimeElapsed;

		if (this.state.audioTimeElapsed === this.state.audioLength) {
			//handle end of episode
		}
	}
	handleVolumeChange(event) {
		this.setState({
			audioVolume: event.target.value
		});

		episodeAudio.volume = this.state.audioVolume;
	}

	play() {
		episodeAudio.play();
		this.setState({
			isPlaying: true
		});
	}

	pause() {
		episodeAudio.pause();
		this.setState({
			isPlaying: false
		});
	}

	handleMute() {
		// console.log('this is min', parseInt(episodeAudio.duration / 60, 10));
		// console.log('this is sec', parseInt(episodeAudio.duration % 60));

		var stateUnmute = this.state.unmute;
		if (stateUnmute) {
			this.setState({
				audioVolume: 0,
				unmute: !stateUnmute
			});
			episodeAudio.muted = true;
		} else {
			this.setState({
				audioVolume: 0.1,
				unmute: !stateUnmute
			});
			episodeAudio.muted = false;
		}
	}

	async bookmark() {
		let episode = this.props.episode;
		await axios.post('/api/bookmarks', { episodeId: episode.id });
	}

	render() {
		console.log('this is render', episodeAudio.currentTime);
		const currentTimeInString = Number(episodeAudio.currentTime / 60).toFixed(2);
		const currentAudioTime = currentTimeInString
			.toString()
			.split('')
			.map((each) => (each === '.' ? ':' : each))
			.join('');

		const durationInMin = parseInt(episodeAudio.duration / 60, 10);
		const durationInSec = parseInt(episodeAudio.duration % 60);

		return (
			<div>
				{this.state.isPlaying ? (
					<IconButton>
						<PauseIcon onClick={this.pause} />
					</IconButton>
				) : (
					<IconButton>
						<PlayArrowIcon onClick={this.play} />
					</IconButton>
				)}
				<IconButton>
					<SkipNextIcon />
				</IconButton>
				<IconButton>
					<ThumbUpIcon />
				</IconButton>
				<IconButton>
					<ThumbDownIcon />
				</IconButton>
				<IconButton>
					<BookmarkOutlinedIcon
						onClick={this.bookmark}
						style={{
							backgroundColor: `mediumaquamarine`
						}}
					/>
				</IconButton>

				{this.state.unmute ? (
					<IconButton>
						<VolumeUp onClick={this.handleMute} />
					</IconButton>
				) : (
					<IconButton>
						<VolumeOff onClick={this.handleMute} />
					</IconButton>
				)}
				<SoundVolume handleVolumeChange={this.handleVolumeChange} audioVolume={this.state.audioVolume} />
				<div style={{ display: 'flex' }}>
					<input
						type="range"
						value={this.state.audioTimeElapsed}
						aria-labelledby="label"
						onChange={this.handleSliderChange}
						min={0}
						max={this.state.audioLength}
						step="any"
						style={{ flexGrow: '3' }}
					/>
					{durationInMin && durationInSec ? (
						<div style={{ float: 'right', flexGrow: '1' }}>
							{currentAudioTime} | {durationInMin}:{durationInSec}
						</div>
					) : (
						<div />
					)}
				</div>
			</div>
		);
	}
}

export default AudioPlayer;
