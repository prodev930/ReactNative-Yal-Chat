import {rootReducer} from './root-reducer';
import {store} from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type RootReducer = ReturnType<typeof rootReducer>;
