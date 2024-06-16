import {MMKV} from 'react-native-mmkv';

/**
 * @description Provider for storage
 * All implementations of storage will be communicate with this provider
 */
class StorageFactory {
  private static pool = new Map<string, MMKV>();
  static provideStorage({
    id,
    path,
    encryptionKey,
  }: {
    id: string;
    path?: string;
    encryptionKey?: string;
  }) {
    if (this.pool.has(id)) {
      return this.pool.get(id) as MMKV;
    }

    const storage = new MMKV({id, path, encryptionKey});
    this.pool.set(id, storage);
    return storage;
  }

  static removeStorage(id: string) {
    if (this.pool.has(id)) {
      const storage = this.pool.get(id);
      storage?.clearAll();
      this.pool.delete(id);
    }
  }
}

export default StorageFactory;
