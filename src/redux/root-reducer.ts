import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {apiStatusReducer} from './api-status-reducer';
import {userReducer} from './user';
import {utilsReducer} from './utils';
import {callStateReducer} from './callState';
import {contactsMapReducer} from './contacts-map';
import {syncStatusReducer} from './sync-status';
import threadsReducer from './threads';
import {mmkvStore} from './storage';

const combinedReducer = combineReducers({
  apiStatus: apiStatusReducer,
  user: userReducer,
  utils: utilsReducer,
  callState: callStateReducer,
  contactsMap: contactsMapReducer,
  syncStatus: syncStatusReducer,
  threads: threadsReducer,
});

export const rootReducer = (state, action) => {
  let stateData = state;
  if (action.type === 'logout/clearReducer') {
    stateData = {};
  }

  return combinedReducer(stateData, action);
};

const persistConfig = {
  key: 'root',
  storage: mmkvStore,
  whitelist: ['user', 'threads'],
  blackList: ['syncStatus', 'contactsMap'],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
