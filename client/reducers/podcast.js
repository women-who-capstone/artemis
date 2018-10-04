import axios from "axios";
import { getRandomNonRepeatingIndices } from '../utilities'

const SET_PODCAST = "SET_PODCAST";
const SET_PODCAST_LIST = "SET_PODCAST_LIST";
const SET_BEST_CATEGORY_PODCASTS = 'SET_BEST_CATEGORY_PODCASTS'

const initState = {
  podcast: {},
  podcastList: [],
  bestCategoryPodcasts: []
};

export const setSinglePodcast = podcast => ({
  type: SET_PODCAST,
  singlePodcast: podcast
});

export const setBestCategoryPodcasts = podcasts => ({
  type: SET_BEST_CATEGORY_PODCASTS,
  bestCategoryPodcasts: podcasts
});

// THUNK CREATORS
const fetchBestCategoryPodcasts = podcastsWithoutEpisodeData => {
  async dispatch => {
    const numEpisodesDesired = 5
    const indices = getRandomNonRepeatingIndices(numEpisodesDesired)
    let podcastPromises, podcastIndex, podcast
    for (let i = 0; i < numEpisodesDesired; i++) {
      podcastIndex = indices[i]
      podcast = podcastsWithoutEpisodeData[podcastIndex]
      if (podcast !== undefined) {
        podcastPromises.push(axios.get(`/api/episode/apiEpisode?id=${podcast.id}`))
      }
    }
    const podcastsWithEpisodeData = await Promise.all(podcastPromises).map(podcast => podcast.data)
    dispatch(setBestCategoryPodcasts(podcastsWithEpisodeData))
  }
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
        PodcastList: action.podcastList
      };
    case SET_BEST_CATEGORY_PODCASTS:
      return ...state,
      bestCategoryPodcasts: action.podcasts
    default:
      return state;
  }
}
