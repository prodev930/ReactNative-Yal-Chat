/* eslint-disable @typescript-eslint/no-explicit-any */
import {DeviceEventEmitter} from 'react-native';
import {newSMSExists, notifyNativeToGetAllThread} from './sync-helpers';
import ASyncServices, {SYNC_STATUS_CALLBACK} from './sync.services.abstract';
import {nativeEvents} from 'constants/events';
// import {threadQueries} from 'database/models/Threads/Threads.queries';
// import {smsChannels} from 'constants/smsChannels';

class ThreadSyncServices2 extends ASyncServices {
  static async sync() {
    try {
      const status = this.getStatus();
      if (status === 'syncing') {
        return;
      }

      const {status: isSync, lastId} = await newSMSExists();

      if (!isSync && lastId) {
        this.setStatus('done');
        return;
      }

      this.setStatus('syncing');
      notifyNativeToGetAllThread();
    } catch (error: any) {
      this.setStatus('error');
      this.setError(error.message);
    }
  }

  static async initListener(callback: SYNC_STATUS_CALLBACK) {
    this.setSyncStatusCallback(callback);

    const threadListener = DeviceEventEmitter.addListener(
      nativeEvents.ALL_THREADS_SYNC_DONE,
      threadRaw => {
        console.log('TRIGGER EVENT THREADS READ FROM DEVICE');
        const threads = JSON.parse(threadRaw);
        this.setStatus('done', threads);
        console.log('------------> ON ALL_THREADS_READ_FROM_DEVICE', threads);
        // Update the component state with the received SMS messages
        // this.syncCursor = thread._id;
        // threadQueries.addThread({
        //   ...thread,
        //   id: thread._id,
        //   date: thread.date,
        // });
      },
    );
    this.addListenerToPool('thread-auto-sync-done', threadListener);
  }
}

export default ThreadSyncServices2;
