/* eslint-disable @typescript-eslint/no-explicit-any */
import {handleContactAppendV2} from './sync-helpers';
import ASyncServices, {SYNC_STATUS_CALLBACK} from './sync.services.abstract';
import ReactNativeContacts from 'react-native-contacts';

class ContactSyncServices extends ASyncServices {
  static async sync() {
    try {
      const status = this.getStatus();
      if (status === 'syncing') {
        return;
      }
      this.setStatus('syncing');
      const allContacts = await ReactNativeContacts.getAll();
      await handleContactAppendV2(allContacts);
      this.setStatus('done', allContacts);
    } catch (error: any) {
      this.setStatus('error');
      this.setError(error.message);
    }
  }

  static async initListener(callback: SYNC_STATUS_CALLBACK) {
    this.setSyncStatusCallback(callback);
  }
}

export default ContactSyncServices;
