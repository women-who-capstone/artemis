import React, { Component } from 'react';

const styles = {
	container: {
		width: '15%',
		font: '10px',
		position: 'absolute',
		left: '30%',

		display: 'table-cell',
		verticalAlign: 'middle'
	},
	spany: {
		verticalAlign: 'middle'
	},
	inputy: { verticalAlign: 'baseline' }
};

class SoundVolume extends Component {
	constructor() {
		super();
		this.state = {
			element: {}
		};
		this.handleSoundVolume = this.handleSoundVolume.bind(this);
		this.changeVolume = this.changeVolume.bind(this);
	}

	handleSoundVolume = () => {
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();
		var gainNode = audioCtx.createGain();
		gainNode.gain.value = 0.5;

		var source = context.createBufferSource();
		source.buffer = BUFFERS.techno;
		//  source.connect(gainNode);
		gainNode.connect(context.destination);
	};

	changeVolume = function(element) {
		var volume = element.value;
		var fraction = parseInt(element.value) / parseInt(element.max);
		// Let's use an x*x curve (x-squared) since simple linear (x) does not
		// sound as good.
		this.gainNode.gain.value = fraction * fraction;
	};

	render() {
		return (
			<div style={styles.container}>
				<label style={styles.spany}>Volume:</label>
				<input
					type="range"
					min="0.0"
					max="1.0"
					step="0.01"
					value="0.3"
					name="volume"
					id="volumeControl"
					className={styles.inputy}
				/>
			</div>
		);
	}
}

export default SoundVolume;

// var VolumeSample = {};
// // Gain node needs to be mutated by volume control.
// VolumeSample.gainNode = null;

// VolumeSample.play = function() {
// 	if (!context.createGain) context.createGain = context.createGainNode;
// 	this.gainNode = context.createGain();
// 	var source = context.createBufferSource();
// 	source.buffer = BUFFERS.techno;

// 	// Connect source to a gain node
// 	source.connect(this.gainNode);
// 	// Connect gain node to destination
// 	this.gainNode.connect(context.destination);
// 	// Start playback in a loop
// 	source.loop = true;
// 	if (!source.start) source.start = source.noteOn;
// 	source.start(0);
// 	this.source = source;
// };

// VolumeSample.changeVolume = function(element) {
// 	var volume = element.value;
// 	var fraction = parseInt(element.value) / parseInt(element.max);
// 	// Let's use an x*x curve (x-squared) since simple linear (x) does not
// 	// sound as good.
// 	this.gainNode.gain.value = fraction * fraction;
// };
