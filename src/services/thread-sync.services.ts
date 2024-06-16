/* eslint-disable @typescript-eslint/no-explicit-any */
import {getAndSaveThreadsV2} from './sync-helpers';
import ASyncServices, {SYNC_STATUS_CALLBACK} from './sync.services.abstract';

class ThreadSyncServices extends ASyncServices {
  static async sync() {
    try {
      const status = this.getStatus();
      if (status === 'syncing') {
        return;
      }
      this.setStatus('syncing');
      await getAndSaveThreadsV2();
      this.setStatus('done');
    } catch (error: any) {
      this.setStatus('error');
      this.setError(error.message);
    }
  }

  static async initListener(callback: SYNC_STATUS_CALLBACK) {
    this.setSyncStatusCallback(callback);
  }
}

export default ThreadSyncServices;
