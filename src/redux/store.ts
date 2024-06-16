import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import {persistedReducer} from './root-reducer';
// import LogRocket from '@logrocket/react-native';
// const createDebugger = require('redux-flipper').default;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      // .concat(LogRocket.reduxMiddleware())
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .concat(require('redux-flipper').default()),
});

export const persistor = persistStore(store);
