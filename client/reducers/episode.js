import axios from "axios";
import { convertPlayedEpisodesArrayToObject } from "../utilities";
//ACTION TYPES
const SET_PLAYED_EPISODES = "SET_PLAYED_EPISODES";
const SET_NEW_PLAYED_EPISODE = "SET_NEW_PLAYED_EPISODE";
const SET_EPISODES_TO_PLAY = "SET_EPISODES_TO_PLAY";

//ACTION CREATORS
// const setPlayedEpisodes = episodes => {
//   return {
//     type: SET_PLAYED_EPISODES,
//     episodes
//   }
// }

const setEpisodesToPlay = episodes => {
  return {
    type: SET_EPISODES_TO_PLAY,
    episodes
  };
};

//THUNK CREATORS

// const fetchPlayedEpisodes = channelId => {
//   async dispatch => {
//     const { data: playedEpisodes } = await axios.get('/channelepisode/:channelId')
//   }
//   dispatch(setPlayedEpisodes(convertPlayedEpisodesArrayToObject(playedEpisodes)))
// }

//REDUCER
const initialState = {
  //playedEpisodes: {},
  episodesToPlay: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case SET_PLAYED_EPISODES:
    //   return {
    //     ...state,
    //     playedEpisodes: action.episodes
    //   }
    default:
      return state;
  }
};
