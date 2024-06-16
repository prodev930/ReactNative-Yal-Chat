import axios from 'axios';
import {store} from 'redux/store';
import {updateAPIStatus} from 'redux/api-status-reducer';
import queryString from 'query-string';
import {dispatchSnackBar} from 'utils/snackbar';

const dispatch = store.dispatch;

const setLoadingTrue = urlString => {
  let url = getURLInitials(urlString);
  if (dispatch && typeof dispatch === 'function') {
    dispatch(updateAPIStatus({url, loading: true}));
  }
};

const setLoadingFalse = urlString => {
  let url = getURLInitials(urlString);
  if (dispatch && typeof dispatch === 'function') {
    dispatch(updateAPIStatus({url, loading: false}));
  }
};

const getURLInitials = url => {
  if (url.includes('?')) {
    return url.slice(0, url.indexOf('?'));
  } else {
    return url;
  }
};

const getConfig = AT => {
  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if (AT) {
    config.headers['Authorization'] = `Bearer ${AT}`;
    return config;
  } else {
    return config;
  }
};

export const get = async (url, AT) => {
  try {
    setLoadingTrue(url);
    const response = await axios.get(url, getConfig(AT));
    setLoadingFalse(url);
    return response;
  } catch (error) {
    setLoadingFalse(url);
    dispatchSnackBar({text: error.response.data.message, color: '#1a1a1a'});
    throw error;
  }
};

export const post = async (url, requestBody, AT) => {
  try {
    setLoadingTrue(url);
    const response = await axios.post(
      url,
      queryString.stringify(requestBody),
      getConfig(AT),
    );
    setLoadingFalse(url);
    return response;
  } catch (error) {
    setLoadingFalse(url);
    dispatchSnackBar({text: error.response.data.message, color: '#1a1a1a'});
    throw error;
  }
};
