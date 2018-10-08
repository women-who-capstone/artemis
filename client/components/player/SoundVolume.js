import React, { Component } from 'react';

const styles = {
	container: {
		width: '130px',
		font: '10px',
		//position: 'relative',
		//left: '25%',
		//bottom: '35%',

		display: 'inline-flex',
		//verticalAlign: 'middle'
	},
	//inputy: { verticalAlign: 'baseline' }
};

class SoundVolume extends Component {
	render() {
		const handleVolumeChange = this.props.handleVolumeChange;
		const audioVolume = this.props.audioVolume;
		console.log('audioVol', audioVolume);
		return (
			<div style={styles.container}>
				<input
					type="range"
					min="0.0"
					max="1.0"
					step="0.01"
					value={audioVolume}
					name="volume"
					onChange={handleVolumeChange}
					className={styles.inputy}
				/>
			</div>
		);
	}
}

export default SoundVolume;
