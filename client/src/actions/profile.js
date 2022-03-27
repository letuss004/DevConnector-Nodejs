import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_REPOS,
    NO_REPOS, LOGOUT
} from './types';


// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/profile/me');
        console.log('profile/me', res)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        console.log('profile/me:', err.msg)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
};


// logout /clear profile
export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE});
    dispatch({type: LOGOUT})
}
