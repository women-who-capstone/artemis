import axios from "axios";

// ACTION TYPES
const SET_USER_CHANNELS = 'SET_USER_CHANNELS'
const SET_USER_CHANNELS_ERROR_STATUS = 'SET_USER_CHANNELS_ERROR_STATUS'
const SET_USER_CHANNELS_LOADING_STATUS = 'SET_USER_CHANNELS_LOADING_STATUS'

//ACTION CREATORS
const setUserChannels = userChannels => {
  return {
    type: SET_USER_CHANNELS,
    userChannels
  }
}

const setUserChannelsErrorStatus = status => {
  return {
    type:  SET_USER_CHANNELS_ERROR,
    status
  }
}

const setUserChannelsLoadingStatus = status => {
  return {
    type: SET_USER_CHANNELS_LOADING_STATUS,
    status
  }
}

// THUNK CREATORS
const fetchUserChannels = userId => {
  return async dispatch => {
    dispatch(setUserChannelsLoadingStatus(true))
    try {
      const { data: userChannels } = await axios.get(`/api/channels/user`)
      dispatch(setUserChannels(userChannels))
      dispatch(setUserChannelsLoadingStatus(false))
      dispatch(setUserChannelsErrorStatus(false))
    } catch (err) {
      dispatch(setUserChannelsLoadingStatus(false))
      dispatch(setUserChannelsErrorStatus(true))
      console.error(err)
    }
  }
}

// REDUCER
const initialState = {
  userChannels: [],
  userChannelsError: false,
  userChannelsLoading: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_CHANNELS:
      return {
        ...state,
        userChannels: action.userChannels
      }
    case SET_USER_CHANNELS_LOADING_STATUS:
      return {
        ...state,
        userChannelsLoading: action.status
      }
    case SET_USER_CHANNELS_ERROR_STATUS:
      return {
        ...state,
        userChannelsError: action.status
      }
  }
}
