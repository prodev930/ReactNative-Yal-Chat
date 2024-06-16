/* eslint-disable @typescript-eslint/no-explicit-any */
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import {Contact} from 'react-native-contacts';
import {threadQueries} from 'database/models/Threads/Threads.queries';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {NativeSMSHandler, RecentCallsNativeModule} from 'nativeModules';
import {RecentCallsQueries} from 'database/models/RecentCalls/RecentCalls.queries';

export const newThreadExists = async () => {
  try {
    const lastSmsFromThread = await threadQueries.threadSyncedTill();
    const lastSmsFromSMS = await SMSQueries.getLastSMS();
    return !lastSmsFromSMS || !lastSmsFromThread
      ? true
      : lastSmsFromSMS.id !== lastSmsFromThread.last_sms_id;
  } catch (err) {
    // console.log(err, 'newThreadExists');
  }
};

export const getAndSaveThreadsV2 = async () => {
  try {
    const exists = await newThreadExists();
    if (!exists) {
      return;
    }
    const threads = await SMSQueries.getThreadsFromSMS();
    const promises = (threads ?? []).map(thread => {
      return threadQueries.addThread(thread);
    });
    await Promise.allSettled(promises);
  } catch (error: any) {
    console.log('getAndSaveThreadsV2', error.message);
  }
};

export const handleContactAppendV2 = async (contacts: Contact[] = []) => {
  try {
    const promises = contacts.map(contact => {
      return ContactQueries.addContact(contact);
    });

    await Promise.allSettled(promises);
  } catch (error: any) {
    console.log('handleContactAppendV2', error.message);
  }
};

export const newSMSExists = async () => {
  const lastSmsFromAndroidDB = await NativeSMSHandler.getLastSMS();
  console.log('LAST SMS , FROm NATIVE', lastSmsFromAndroidDB);
  const lastSmsFromRealmdDB = await SMSQueries.getLastSMS();
  console.log('LAST SMS FROM REALM', lastSmsFromRealmdDB);
  if (lastSmsFromAndroidDB === 'no sms exists') {
    return {
      status: false,
      lastId: 1,
    };
  } else {
    const status =
      parseInt(lastSmsFromAndroidDB?._id) !== lastSmsFromRealmdDB?.id;
    const lastId = lastSmsFromRealmdDB?.id;
    return {
      status,
      lastId,
    };
  }
};

export const fetchRecentCalls = async () => {
  RecentCallsNativeModule.getRecentCalls();
};

export const fetchRecentCallsTillId = async (id: string) => {
  RecentCallsNativeModule.getRecentCallsTillId(id);
};

export const newCallLogExist = async () => {
  const lastRecentLogFromANdroidDB =
    await RecentCallsNativeModule.getLastRecentCall();
  const lastCallFromRealmDB = await RecentCallsQueries.getLastRecentCall();
  if (lastRecentLogFromANdroidDB === 'no sms exists') {
    return {
      status: false,
      lastId: 1,
    };
  } else {
    const status =
      `${lastRecentLogFromANdroidDB?._id}` !==
      `${lastCallFromRealmDB?.recordID}`;
    const lastId = lastCallFromRealmDB?.recordID;
    return {
      status,
      lastId,
    };
  }
};

export function notifyNativeToGetAllThread() {
  console.log('CALLL TO NATIVE TO GET ALL THREADS');
  NativeSMSHandler.getAllThreads2();
}
