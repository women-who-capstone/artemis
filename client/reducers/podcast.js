import axios from "axios";

const SET_PODCAST = "SET_PODCAST";
const SET_PODCAST_LIST = "SET_PODCAST_LIST";

const initState = {
  podcast: {},
  podcastList: []
};

export const setSinglePodcast = podcast => ({
  type: SET_PODCAST,
  singlePodcast: podcast
});

export const setPodcastList = podcasts => ({
  type: SET_PODCAST_LIST,
  podcastList: podcasts
});

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
    default:
      return state;
  }
}
