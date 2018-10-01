import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GOT_USER = 'GOT_USER'
const LOGGED_OUT_USER = 'LOGGED_OUT_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const gotUser = user => ({ type: GOT_USER, user })
const loggedOutUser = () => ({ type: LOGGED_OUT_USER })

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(gotUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, { email, password })
  } catch (authError) {
    return dispatch(gotUser({ error: authError }))
  }

  try {
    dispatch(gotUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(loggedOutUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GOT_USER:
      return action.user
    case LOGGED_OUT_USER:
      return defaultUser
    default:
      return state
  }
}
