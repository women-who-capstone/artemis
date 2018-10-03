import React, { Component } from 'react';

// class AudioPlayer extends Component {

//   const episodeAudio = new Audio(this.props.audio)
//   episodeAudio.controls = true
//   render() {
//     return (
//       <div>
//         {episodeAudio}
//       </div>
//     );
//   }
// }

const AudioPlayer = (props) => {
  const episodeAudio = new Audio(props.audio)
  episodeAudio.controls = true
  //episodeAudio.preload = "auto"
  return (
    episodeAudio
  )
}

export default AudioPlayer
