import axios from "axios";
import { getRandomNonRepeatingIndices, setLocalStorage } from '../utilities'

const SET_PODCAST = "SET_PODCAST";
const SET_PODCAST_LIST = "SET_PODCAST_LIST";
const SET_BEST_CATEGORY_PODCASTS = 'SET_BEST_CATEGORY_PODCASTS'
const SET_CURRENT_EPISODE = 'SET_CURRENT_EPISODE'

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
  recommendedEpisodes: []
}

export const setSinglePodcast = podcast => ({
  type: SET_PODCAST,
  singlePodcast: podcast
});

export const setBestCategoryPodcasts = podcasts => ({
  type: SET_BEST_CATEGORY_PODCASTS,
  podcasts
});

// THUNK CREATORS
export const fetchCategoryPodcastsEpisodeData = podcastsWithoutEpisodeData => {
  return async dispatch => {
    let numEpisodesDesired = podcastsWithoutEpisodeData.length >= 5 ? 5 : podcastsWithoutEpisodeData.length

    const indices = getRandomNonRepeatingIndices(numEpisodesDesired, podcastsWithoutEpisodeData.length)

    try {
      let podcastPromises = []
      let podcastIndex, podcast
      for (let i = 0; i < indices.length; i++) {
        podcastIndex = indices[i]
        podcast = podcastsWithoutEpisodeData[podcastIndex]
        if (podcast !== undefined) {
          podcastPromises.push(axios.get(`/api/episode/apiEpisode?id=${podcast.id}`))
        }
      }
      const resolvedPodcastPromises = await Promise.all(podcastPromises)

      const podcastsWithEpisodeData = resolvedPodcastPromises.map(elem => elem.data)

      if (podcastsWithEpisodeData.length === 0) {
        throw new Error('podcastsWithEpisodeData is empty.')
      }
      dispatch(setBestCategoryPodcasts(podcastsWithEpisodeData))
    } catch (error) {
      console.error(error)
    }
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
        podcastList: action.podcastList
      };
    case SET_BEST_CATEGORY_PODCASTS:
      //const newState = setLocalStorage('podcastState', action.podcasts, 'bestCategoryPodcasts')
      return {
        ...state,
        bestCategoryPodcasts: action.podcasts
      }
    default:
      return state;
  }
}
