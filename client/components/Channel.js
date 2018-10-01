import React from 'react'
import PodcastPlayer from './index'
import { connect } from 'react-redux'
import axios from 'axios'

class SingleChannel extends React.Component {
  constructor() {
    super()
    this.state = {
      episode: {}
    }
    this.setEpisode = this.setEpisode.bind(this)
  }

  setEpisode = async function() {
    const channelId = this.props.match.params.channelId
    console.log(channelId)
    const res = await axios.get(
      `/api/episode/apiEpisode?id=${this.props.episodeId}`
    )
    const episode = res.data.episodes[0]
    episode.channelId = channelId
    console.log('EPISODE', episode)
    this.setState({
      episode
    })
    await axios.post('/api/episode', episode)
  }

  // setTags = async function(){
  //   const
  // }

  //when Next, Dislike or Like is clicked => have function that updates the store with new episode relating to tags.

  componentDidMount() {
    this.setEpisode()
    //this.setTags()
  }
  render() {
    console.log('AUDIO URL', this.state.episode.audio)
    return <PodcastPlayer audioSource={this.state.episode.audio} />
  }
}

const mapStateToProps = state => {
  return {
    episodeId: state.podcast.podcast.id
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     setSinglePodcast: episode => dispatch(setSinglePodcast(episode)),
//     setPodcastList: episodes => dispatch(setPodcastList(episodes))
//   };
// };

export default connect(
  mapStateToProps,
  null
)(SingleChannel)
