import {callsChannels} from 'constants/callsChannels';
import {nativeEvents} from 'constants/events';
import {smsChannels} from 'constants/smsChannels';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {RecentCallsQueries} from 'database/models/RecentCalls/RecentCalls.queries';
import {SMSQueries} from 'database/models/SMS/SMS.queries';
import {threadQueries} from 'database/models/Threads/Threads.queries';
import {NativeSMSHandler, RecentCallsNativeModule} from 'nativeModules';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import ReactNativeContacts from 'react-native-contacts';
import {useDispatch, useSelector} from 'react-redux';
import {addContacts} from 'redux/contacts-map';
const newSMSExists = async () => {
  const lastSmsFromAndroidDB = await NativeSMSHandler.getLastSMS();
  const lastSmsFromRealmdDB = await SMSQueries.getLastSMS();
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

const newCallLogExist = async () => {
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

const newThreadExists = async () => {
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

const fetchSms = async () => {
  NativeSMSHandler.getAllSms();
};

const fetchSmsTillId = async id => {
  NativeSMSHandler.getAllSmsTillId(id);
};

const getAndSaveThreads = async setThreadsGenerationDone => {
  try {
    const exists = await newThreadExists();
    if (exists) {
      const threads = await SMSQueries.getThreadsFromSMS();
      threads.forEach(async thread => {
        try {
          threadQueries.addThread(thread);
        } catch (error) {
          // console.log(error, 'getAndSaveThreads, inside loop while inserting');
        }
      });
      setThreadsGenerationDone(true);
    } else {
      setThreadsGenerationDone(true);
    }
  } catch (error) {
    setThreadsGenerationDone(true);
    // console.log(error, 'getAndSaveThreads');
  }
};

const handleContactAppend = async contacts => {
  try {
    contacts.forEach(async ct => {
      const c = await ContactQueries.addContact(ct);
    });
  } catch (error) {
    // console.log(error, 'handleContactAppend');
  }
};

const fetchRecentCalls = async () => {
  RecentCallsNativeModule.getRecentCalls();
};

const fetchRecentCallsTillId = async id => {
  RecentCallsNativeModule.getRecentCallsTillId(id);
};

const useSync = permissions => {
  const [smsSyncDone, setSmsSyncDone] = useState(false);
  const [threadsGenerationDone, setThreadsGenerationDone] = useState(false);
  const [idBeingSynced, setIdBeingSynced] = useState('');
  const [contactSyncDone, setContactSyncDone] = useState(false);
  const dispatch = useDispatch();

  const handleSMSSync = useCallback(async () => {
    const {status, lastId} = await newSMSExists();
    if (status && lastId) {
      fetchSmsTillId(`${lastId}`);
    } else if (!status && lastId) {
      setSmsSyncDone(true);
    } else {
      fetchSms();
    }
  }, []);

  const handleContactsSync = useCallback(async () => {
    ReactNativeContacts.getAll()
      .then(contacts => {
        /**
         * add contacts map to redux to display
         * dont use realm query here as it will be slow
         */
        dispatch(addContacts({contacts}));
        return handleContactAppend(contacts);
      })
      .then(result => {
        setContactSyncDone(true);
      });
  }, [dispatch]);

  useEffect(() => {
    const smsListner = DeviceEventEmitter.addListener(
      nativeEvents.SMS_READ_FROM_DEVICE,
      smsMessages => {
        const sms = JSON.parse(smsMessages);
        // Update the component state with the received SMS messages
        setIdBeingSynced(sms._id);
        SMSQueries.addSMS({
          ...sms,
          id: sms._id,
          date: sms.date,
          channel: smsChannels.text,
        });
      },
    );
    const smsDoneListner = DeviceEventEmitter.addListener(
      nativeEvents.SMS_SYNC_DONE,
      done => {
        setSmsSyncDone(true);
      },
    );
    return () => {
      smsListner.remove();
      smsDoneListner.remove();
    };
  }, []);

  // commented hook 1
  // useEffect(() => {
  //   if (smsSyncDone && !threadsGenerationDone) {
  //     getAndSaveThreads(setThreadsGenerationDone);
  //   }
  // }, [smsSyncDone, threadsGenerationDone]);

  // commented hook 2
  // useEffect(() => {
  //   if (permissions && smsSyncDone && threadsGenerationDone) {
  //     handleContactsSync();
  //   }
  // }, [permissions, smsSyncDone, threadsGenerationDone]);

  // commented hook 3
  // useEffect(() => {
  //   if (permissions) {
  //     handleSMSSync();
  //   }
  // }, [permissions]);

  // new functions to reduce sync time
  const syncContacts = useCallback(() => {
    if (permissions && smsSyncDone && threadsGenerationDone) {
      handleContactsSync();
    }
  }, [handleContactsSync, permissions, smsSyncDone, threadsGenerationDone]);

  const syncSMS = useCallback(() => {
    if (permissions) {
      handleSMSSync();
    }
  }, [handleSMSSync, permissions]);

  const getAndSaveThreadsAsync = useCallback(() => {
    if (smsSyncDone && !threadsGenerationDone) {
      getAndSaveThreads(setThreadsGenerationDone);
    }
  }, [smsSyncDone, threadsGenerationDone]);

  useLayoutEffect(() => {
    try {
      Promise.all([syncContacts(), syncSMS(), getAndSaveThreadsAsync()]);
    } catch (error) {
      console.log('🚀 ~ useEffect ~ error:', error);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, smsSyncDone, threadsGenerationDone]);

  return {
    smsSyncDone,
    threadsGenerationDone,
    contactSyncDone,
    idBeingSynced,
  };
};

export default useSync;

export const useRecentCallSync = permissions => {
  const [recentCallIdBeingSynced, setRecentCallIdBeingSynced] = useState('');
  const [recentCallSyncDone, setRecentCallSyncDone] = useState(false);

  const {callState} = useSelector(state => state.callState);

  const handleRecentCallsSync = async () => {
    const {status, lastId} = await newCallLogExist();
    if (status && lastId) {
      fetchRecentCallsTillId(`${lastId}`);
    } else if (!status && lastId) {
      setRecentCallSyncDone(true);
    } else {
      fetchRecentCalls();
    }
  };

  useEffect(() => {
    const recentCallsListener = DeviceEventEmitter.addListener(
      nativeEvents.RECENT_CALL_READ_FROM_DEVICE,
      l => {
        const log = JSON.parse(l);
        console.log(log._id);
        // Update the component state with the received SMS messages
        setRecentCallIdBeingSynced(log._id);
        RecentCallsQueries.addCallLog({
          ...log,
          channel: callsChannels.native,
        });
      },
    );

    const callSyncDoneListener = DeviceEventEmitter.addListener(
      nativeEvents.RECENT_CALL_READ_FROM_DEVICE_DONE,
      done => {
        setRecentCallSyncDone(true);
      },
    );
    return () => {
      recentCallsListener.remove();
      callSyncDoneListener.remove();
    };
  }, []);

  useLayoutEffect(() => {
    console.log({callState, permissions});
    if (permissions) {
      handleRecentCallsSync();
    }
  }, [permissions, callState]);

  return {recentCallIdBeingSynced, recentCallSyncDone};
};
