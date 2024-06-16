/* eslint-disable @typescript-eslint/no-explicit-any */
import ASyncServices, {SYNC_STATUS_CALLBACK} from './sync.services.abstract';
import {DeviceEventEmitter} from 'react-native';
import {nativeEvents} from 'constants/events';
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import {smsChannels} from 'constants/smsChannels';
import {NativeSMSHandler} from 'nativeModules';
import {newSMSExists} from './sync-helpers';

class SMSSyncService extends ASyncServices {
  static async sync() {
    try {
      const status = this.getStatus();
      if (status === 'syncing') {
        return;
      }

      this.setStatus('syncing');

      const {status: isSync, lastId} = await newSMSExists();
      if (isSync && lastId) {
        //
        console.log('-------> TRIGGER SYNC TO THE LAST ID', lastId);
        NativeSMSHandler.getAllSmsTillId(`${lastId}`);
      } else if (!isSync && lastId) {
        console.log('-------> IGNORE SYNC AND  MARKED AS DONE');
        this.setStatus('done');
      } else {
        console.log('-------> TRIGGER SYNC FROM THE START');
        NativeSMSHandler.getAllSms();
      }
    } catch (error: any) {
      this.setStatus('error');
      this.setError(error?.message ?? 'Unknown error');
    }
  }

  static initListener(callback: SYNC_STATUS_CALLBACK) {
    //
    this.setSyncStatusCallback(callback);
    const smsListener = DeviceEventEmitter.addListener(
      nativeEvents.SMS_READ_FROM_DEVICE,
      smsMessages => {
        const sms = JSON.parse(smsMessages);
        console.log('------------> ON SMS COMING', sms);
        // Update the component state with the received SMS messages
        this.syncCursor = sms._id;
        SMSQueries.addSMS({
          ...sms,
          id: sms._id,
          date: sms.date,
          channel: smsChannels.text,
        });
      },
    );
    this.addListenerToPool('sms-auto-sync', smsListener);
    const smsDoneListener = DeviceEventEmitter.addListener(
      nativeEvents.SMS_SYNC_DONE,
      done => {
        console.log('------------> ON SMS SYNC DONE', done);
        this.setStatus('done');
      },
    );
    this.addListenerToPool('sms-sync-done-event', smsDoneListener);
  }
}

export default SMSSyncService;
