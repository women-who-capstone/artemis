import axios from "axios";
import {
  getRandomNonRepeatingIndices,
  setLocalStorage,
  convertPlayedEpisodesArrayToObject
} from "../utilities";

const SET_PODCAST = "SET_PODCAST";
const SET_PODCAST_LIST = "SET_PODCAST_LIST";
const SET_BEST_CATEGORY_PODCASTS = "SET_BEST_CATEGORY_PODCASTS";
const SET_CURRENT_EPISODE = "SET_CURRENT_EPISODE";
const SET_PLAYED_EPISODES = "SET_PLAYED_EPISODES";
const SET_ADDED_PLAYED_EPISODE = 'SET_ADDED_PLAYED_EPISODE'
const SET_RECOMMENDED_EPISODES = 'SET_RECOMMENDED_EPISODES'
// if (localStorage.getItem('podcastState') === null) {
//     localStorage.setItem('podcastState', JSON.stringify({
//     podcast: {},
//     podcastList: [],
//     bestCategoryPodcasts: [],
//     recommendedEpisodes: []
//   }))
// }

// const initState = JSON.parse(localStorage.getItem('podcastState'))

const initState = {
  podcast: {},
  podcastList: [],
  bestCategoryPodcasts: [],
  recommendedEpisodes: [],
  playedEpisodes: {}
};

export const setSinglePodcast = podcast => ({
  type: SET_PODCAST,
  singlePodcast: podcast
});

export const setBestCategoryPodcasts = podcasts => ({
  type: SET_BEST_CATEGORY_PODCASTS,
  podcasts
});

export const setPlayedEpisodes = episodes => ({
  type: SET_PLAYED_EPISODES,
  episodes
});

export const setAddedPlayedEpisode = episode => ({
  type: SET_ADDED_PLAYED_EPISODE,
  episode
})

export const setRecommendedEpisodes = episodes => ({
  type: SET_RECOMMENDED_EPISODES,
  episodes
})

// THUNK CREATORS
export const fetchCategoryPodcastsEpisodeData = podcastsWithoutEpisodeData => {
  return async dispatch => {
    let numEpisodesDesired =
      podcastsWithoutEpisodeData.length >= 5
        ? 5
        : podcastsWithoutEpisodeData.length;

    const indices = getRandomNonRepeatingIndices(
      numEpisodesDesired,
      podcastsWithoutEpisodeData.length
    );

    try {
      let podcastPromises = [];
      let podcastIndex, podcast;
      for (let i = 0; i < indices.length; i++) {
        podcastIndex = indices[i];
        podcast = podcastsWithoutEpisodeData[podcastIndex];
        if (podcast !== undefined) {
          podcastPromises.push(
            axios.get(`/api/episode/apiEpisode?id=${podcast.id}`)
          );
        }
      }
      const resolvedPodcastPromises = await Promise.all(podcastPromises);

      const podcastsWithEpisodeData = resolvedPodcastPromises.map(
        elem => elem.data
      );

      if (podcastsWithEpisodeData.length === 0) {
        throw new Error("podcastsWithEpisodeData is empty.");
      }
      dispatch(setBestCategoryPodcasts(podcastsWithEpisodeData));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchPlayedEpisodes = channelId => {
  return async dispatch => {
    let res = await axios.get(`/api/channel?id=${channelId}`);
    let playedEpisodes = res.data[0].episodes;

    const episodesObject = convertPlayedEpisodesArrayToObject(playedEpisodes);
    dispatch(setPlayedEpisodes(episodesObject))
  };
};

export const addPlayedEpisode = (episode, channelId) => {
  return async dispatch => {
    episode.channelId = channelId;
    try {
      let req = await axios.post("/api/episode", episode);
      let newEpisode = req.data;
      dispatch(setAddedPlayedEpisode(newEpisode))
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchRecommendedEpisodes = (channelId) => {

}

//REDUCER
export default function(state = initState, action) {
  switch (action.type) {
    case SET_PODCAST:
      return {
        ...state,
        podcast: action.singlePodcast
      };
    case SET_PODCAST_LIST:
      return {
        ...state,
        podcastList: action.podcastList
      };
    case SET_BEST_CATEGORY_PODCASTS:
      //const newState = setLocalStorage('podcastState', action.podcasts, 'bestCategoryPodcasts')
      return {
        ...state,
        bestCategoryPodcasts: action.podcasts
      };
    case SET_PLAYED_EPISODES:
      return {
        ...state,
        playedEpisodes: action.episodes
      };
    case SET_ADDED_PLAYED_EPISODE:
      return {
        ...state,
        playedEpisodes: {
          ...state.playedEpisodes,
          [action.episode.id]: true
        }
      }
    case SET_RECOMMENDED_EPISODES:
      return {
        ...state,
        recommendedEpisodes: action.episodes
      }
    default:
      return state;
  }
}
