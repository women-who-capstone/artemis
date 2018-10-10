import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GOT_USER = 'GOT_USER';
const LOGGED_OUT_USER = 'LOGGED_OUT_USER';
const CLEAR_ERROR = 'CLEAR_ERROR';

/**
 * INITIAL STATE
 */
const defaultUser = {
	error: ''
};

/**
 * ACTION CREATORS
 */
const gotUser = (user) => ({ type: GOT_USER, user });
const loggedOutUser = () => ({ type: LOGGED_OUT_USER });
const removeError = (err) => ({ type: CLEAR_ERROR, err });

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
	try {
		const res = await axios.get('/auth/me');
		dispatch(gotUser(res.data || defaultUser));
	} catch (err) {
		console.error(err);
	}
};

export const deleteError = (dispatch) => {
	dispatch(removeError({ error: '' }));
};

export const auth = (email, password, method) => async (dispatch) => {
	let res;
	try {
		res = await axios.post(`/auth/${method}`, { email, password });
	} catch (authError) {
		return dispatch(gotUser({ error: authError }));
	}

	try {
		dispatch(gotUser(res.data));
		if (method === 'signup') {
			history.push('/createchannel');
		} else {
			let result = await axios.get('api/channel/user');
			const userChannels = result.data;
			if (!userChannels.length) {
				history.push('/createchannel');
			} else {
				history.push('/allchannels');
			}
		}
	} catch (dispatchOrHistoryErr) {
		console.error(dispatchOrHistoryErr);
	}
};

export const logout = () => async (dispatch) => {
	try {
		await axios.post('/auth/logout');
		dispatch(loggedOutUser());
		history.push('/');
	} catch (err) {
		console.error(err);
	}
};

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
	switch (action.type) {
		case GOT_USER:
			return action.user;
		case LOGGED_OUT_USER:
			return defaultUser;
		case CLEAR_ERROR:
			return { ...state, error: action.type };
		default:
			return state;
	}
}
