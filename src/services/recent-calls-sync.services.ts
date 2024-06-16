import {DeviceEventEmitter} from 'react-native';
import {
  fetchRecentCalls,
  fetchRecentCallsTillId,
  newCallLogExist,
} from './sync-helpers';
import ASyncServices, {SYNC_STATUS_CALLBACK} from './sync.services.abstract';
import {nativeEvents} from 'constants/events';
import {RecentCallsQueries} from 'database/models/RecentCalls/RecentCalls.queries';
import {callsChannels} from 'constants/callsChannels';

class RecentCallSyncService extends ASyncServices {
  static async sync() {
    try {
      const syncStatus = this.getStatus();
      if (syncStatus === 'syncing') {
        return;
      }
      this.setStatus('syncing');

      const {status, lastId} = await newCallLogExist();
      if (status && lastId) {
        fetchRecentCallsTillId(`${lastId}`);
      } else if (!status && lastId) {
        this.setStatus('done');
      } else {
        fetchRecentCalls();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.setStatus('error');
      this.setError(error.message);
    }
  }

  static initListener(callback: SYNC_STATUS_CALLBACK) {
    this.setSyncStatusCallback(callback);
    const recentCallsListener = DeviceEventEmitter.addListener(
      nativeEvents.RECENT_CALL_READ_FROM_DEVICE,
      recentCall => {
        const log = JSON.parse(recentCall);
        console.log('------------> ON RECENT CALL COMING', recentCall);
        // Update the component state with the received SMS messages
        this.syncCursor = log._id;
        RecentCallsQueries.addCallLog({
          ...log,
          channel: callsChannels.native,
        });
      },
    );
    this.addListenerToPool('recent-calls-auto-sync', recentCallsListener);
    const callSyncDoneListener = DeviceEventEmitter.addListener(
      nativeEvents.RECENT_CALL_READ_FROM_DEVICE_DONE,
      done => {
        console.log('------------> ON RECENT CALL SYNC DONE', done);
        this.setStatus('done');
      },
    );
    this.addListenerToPool(
      'recent-calls-sync-done-event',
      callSyncDoneListener,
    );
  }
}

export default RecentCallSyncService;
