import {Storage} from 'redux-persist';
import StorageFactory from 'services/storage.services';

export const rootStorage = StorageFactory.provideStorage({id: 'rootStorage'});

export const mmkvStore: Storage = {
  setItem: (key, value) => {
    rootStorage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = rootStorage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    rootStorage.delete(key);
    return Promise.resolve();
  },
};
