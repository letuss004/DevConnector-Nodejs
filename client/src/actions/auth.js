import axios from 'axios';
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR} from "./types";
import {setAlert} from "./alert";
import setAuthToken from "../utils/setAuthToken";


// Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
        console.log(res)

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
        console.log(err)
    }
};


// Register User
export const register = ({name, email, password}) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, email, password});

    try {
        const res = await axios.post(
            '/api/users', body, config
        );
        console.log('Response:', res);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(
                error => dispatch(
                    setAlert(error.msg, 'danger')
                )
            );
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
};
