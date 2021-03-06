import axios from 'axios';
import Cookies from 'js-cookie';
import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';
import { SIGN_UP, SIGN_IN, PW_NOT_SAME, UPDATE_USER, GET_USER, LOGGED_OUT,
        USER_LIST, USER_APPS, USER_POSTS } from './actionTypes';

export function userSignUp(info) {
  info.phone = parseInt(info.phone.split(' ').join(''));
  return (dispatch) => {
    if (info.password !== info.passconfirm) {
      dispatch({ type: PW_NOT_SAME, payload: 'Passwords not same' });
    } else {
      return axios.post('/auth/signup', info)
        .then((response) => {
          dispatch({ type: SIGN_UP, payload: response.data });
          if (typeof response.data !== 'string') {
            Cookies.set('user', response.data.user);
            Cookies.set('token', response.data.token);
          } else {
            if (response.data.includes('username')) {
              throw new SubmissionError({ username: 'username already exists', _error: 'Please try again' });
            }
            if (response.data.includes('email')) {
              throw new SubmissionError({ email: 'E-mail already exists', _error: 'Please try again' });
            }
          }
        });
      }
  };
}

export function userLogOut() {
  return (dispatch) => {
    dispatch({ type: LOGGED_OUT });
    Cookies.remove('user');
    Cookies.remove('token');
  };
}

export function userSignIn(info) {
  const request = axios.get('/auth/signin', { params: info });
  return dispatch => {
    return request
      .then(response => {
        dispatch({ type: SIGN_IN, payload: response.data });
        Cookies.set('user', response.data.user);
        Cookies.set('token', response.data.token);

      })
      .catch(err => {
        // dispatch({ type: PW_NOT_SAME, payload: 'Passwords not same' });
        throw new SubmissionError({ _error: 'Invalid username or password' });
      });
  };
}

export function getUserInfo(id) {
  return dispatch => {
  return axios.get('/db/users/' + id, { headers: { 'x-access-token': Cookies.getJSON('token') } })
    .then(response => {
      dispatch({ type: GET_USER, payload: response.data });
      browserHistory.push('/userprofile');
    });
  };
}

export function getUser(id) {
  return dispatch => {
  return axios.get('/db/users/' + id, { headers: { 'x-access-token': Cookies.getJSON('token') } })
    .then(response => {
      dispatch({ type: GET_USER, payload: response.data });
    });
  };
}

export function getUserList(ids) {
  const config = { params: { field: 'id', key: `[${ids.toString()}]` }, headers: { 'x-access-token': Cookies.getJSON('token') } };
  return dispatch => {
    return axios.get('/db/users/query', config)
      .then(response => {
        dispatch({ type: USER_LIST, payload: response.data });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function updateUserInfo(info) {
  info.phone = parseInt(info.phone.split(' ').join(''));
  return dispatch => {
    return axios.post('/db/users/update', { id: Cookies.getJSON('user').userid, fields: info }, { headers: { 'x-access-token': Cookies.getJSON('token') } })
      .then(response => {
        dispatch({ type: UPDATE_USER, payload: response.data });
        throw new SubmissionError({ _error: 'User Profile Updated!' });
      });
  };
}

export function getUserApps() {
  return dispatch => {
    return axios.get('/db/applicant/getAll',
    {
      params: { key: Cookies.getJSON('user').userid, field: 'user_id' },
      headers: { 'x-access-token': Cookies.getJSON('token') }
    })
    .then(response => {
      dispatch({ type: USER_APPS, payload: response.data });
    });
  };
}

export function getUserPosts() {
  return dispatch => {
    return axios.get('/db/jobs/query',
    {
      params: { key: Cookies.getJSON('user').userid, field: 'user_id' },
      headers: { 'x-access-token': Cookies.getJSON('token') }
    })
    .then(response => {
      dispatch({ type: USER_POSTS, payload: response.data });
    });
  };
}
