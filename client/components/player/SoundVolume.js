import React, { Component } from 'react';

const styles = {
	container: {
		width: '130px',
		font: '10px',
		display: 'inline-flex'
	}
};

class SoundVolume extends Component {
	render() {
		const handleVolumeChange = this.props.handleVolumeChange;
		const audioVolume = this.props.audioVolume;

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
