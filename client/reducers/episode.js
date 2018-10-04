import axios from 'axios'

//ACTION TYPES
const SET_PLAYED_EPISODES = 'SET_PLAYED_EPISODES'
const SET_NEW_PLAYED_EPISODE = 'SET_NEW_PLAYED_EPISODE'

//ACTION CREATORS
const setPlayedEpisodes = episodes => {
  return {
    type: SET_PLAYED_EPISODES,
    episodes
  }
}

//THUNK CREATORS
const fetchPlayedEpisodes = channelId => {
  async dispatch => {
    const { data: playedEpisodes } = await axios.get('')
  }
}

//REDUCER
const initialState =  {
  playedEpisodes: {}
}

const reducer = (state = initialState, action)  => {
  switch (action.type) {
    case SET_PLAYED_EPISODES:
      return {
        ...state,
        playedEpisodes: action.episodes
      }
    default:
      return state
  }
}
