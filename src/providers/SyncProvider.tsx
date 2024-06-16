import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SYNC_STATUS} from 'services/sync.services.abstract';
import {
  selectIsAllPermissionGranted,
  // selectSMSSyncStatus,
  setContactSyncStatus,
  setRecentCallsSyncStatus,
  // setSMSSyncStatus,
  // setThreadSyncStatus,
} from 'redux/sync-status';
// import SMSSyncService from 'services/sms-sync.services';
import ContactSyncServices from 'services/contacts-sync.services';
import {Contact} from 'models/contacts';
import {addContacts} from 'redux/contacts-map';
// import ThreadSyncServices from 'services/thread-sync.services';
import {AppContext} from '../../App';
import usePermissions from 'hooks/usePermissions';
import RecentCallSyncService from 'services/recent-calls-sync.services';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import TanStackQueryService from 'services/query-services';
import ThreadQueryServices from 'services/thread-query.services';

// import ThreadSyncServices2 from 'services/thread-sync2.services';
// import {Thread} from 'models/threads';
// import {setThreads} from 'redux/threads';

interface SyncProviderProps {
  children: React.ReactNode;
}

const SyncProvider: React.FC<SyncProviderProps> = props => {
  const dispatch = useDispatch();
  // const smsSyncStatus = useSelector(selectSMSSyncStatus);
  const granted = useSelector(selectIsAllPermissionGranted);
  console.log('🚀 ~ granted:', granted);
  const {grantedDefaultDialer, grantedDefaultSMS} = useContext(AppContext);
  console.log(
    '🚀 ~ grantedDefaultDialer, grantedDefaultSMS:',
    grantedDefaultDialer,
    grantedDefaultSMS,
  );
  /**
   * custom hook to trigger permissions here,
   * should be return nothing
   * permissions all granted status are stored in redux
   */
  usePermissions(grantedDefaultSMS, grantedDefaultDialer);

  // const onSMSSyncStatusChange = useCallback(
  //   (status: SYNC_STATUS) => {
  //     dispatch(setSMSSyncStatus(status));
  //   },
  //   [dispatch],
  // );

  const onContactSyncStatusChange = useCallback(
    (status: SYNC_STATUS, contacts: Contact[] = []) => {
      if (status === 'done' && Array.isArray(contacts)) {
        dispatch(addContacts({contacts}));
      }
      dispatch(setContactSyncStatus(status));
    },
    [dispatch],
  );

  // const onThreadSyncStatusChange = useCallback(
  //   (status: SYNC_STATUS, data: Thread[]) => {
  //     console.log('------> NATIVE THREAD SYNC STATUS UPDATE', status);
  //     if (status === 'done' && data?.length > 0) {
  //       dispatch(setThreads(data));
  //     }
  //     dispatch(setThreadSyncStatus(status));
  //   },
  //   [dispatch],
  // );

  const onRecentCallsSyncStatusChange = useCallback(
    (status: SYNC_STATUS) => {
      dispatch(setRecentCallsSyncStatus(status));
    },
    [dispatch],
  );

  // useLayoutEffect(() => {
  //   console.log('---------> INIT SMS SYNC LISTENERS');
  //   SMSSyncService.initListener(onSMSSyncStatusChange);
  //   return () => {
  //     // Clear the listener when the component is unmounted
  //     console.log('---------> CLEARING SMS SYNC LISTENERS');
  //     SMSSyncService.clearListeners();
  //   };
  // }, [onSMSSyncStatusChange]);

  useLayoutEffect(() => {
    console.log('---------> INIT CONTACT SYNC LISTENERS');
    ContactSyncServices.initListener(onContactSyncStatusChange);
    return () => {
      console.log('---------> CLEARING CONTACT SYNC LISTENERS');
      ContactSyncServices.clearListeners();
    };
  }, [onContactSyncStatusChange]);

  useLayoutEffect(() => {
    console.log('---------> INIT RECENT CALLS SYNC LISTENERS');
    RecentCallSyncService.initListener(onRecentCallsSyncStatusChange);
    return () => {
      console.log('---------> CLEARING RECENT CALLS SYNC LISTENERS');
      RecentCallSyncService.clearListeners();
    };
  }, [onRecentCallsSyncStatusChange]);

  // useLayoutEffect(() => {
  //   console.log('---------> INIT THREAD SYNC JS LISTENER - SYNC BASE ON SMS');
  //   ThreadSyncServices.initListener((status: SYNC_STATUS) => {
  //     console.log('------> THREAD SYNC JS STATUS UPDATE', status);
  //   });
  //   return () => {
  //     console.log(
  //       '---------> CLEAR THREAD SYNC JS LISTENER - SYNC BASE ON SMS',
  //     );
  //     ThreadSyncServices.clearListeners();
  //   };
  // }, []);

  // useLayoutEffect(() => {
  //   console.log('---------> INIT NATIVE THREAD SYNC LISTENERS');
  //   ThreadSyncServices2.initListener(onThreadSyncStatusChange);
  //   return () => {
  //     console.log('---------> CLEARING NATIVE THREAD SYNC LISTENERS');
  //     ThreadSyncServices2.clearListeners();
  //   };
  // }, [onThreadSyncStatusChange]);

  useEffect(() => {
    // sync when all permissions are granted
    if (granted) {
      // setTime 0 necessary to ensure the syncs are called after listeners are set
      setTimeout(() => {
        // SMSSyncService.sync();
        ContactSyncServices.sync();
        RecentCallSyncService.sync();
        // ThreadSyncServices2.sync();
      }, 0);
    }
  }, [granted]);

  /**
   * thread sync have to start before sms done to collect enough thread
   */
  // useEffect(() => {
  //   if (smsSyncStatus === 'done') {
  //     ThreadSyncServices.sync();
  //   }
  // }, [smsSyncStatus]);

  /** prefetch Thread list */
  useLayoutEffect(() => {
    if (granted) {
      // default key for thread list
      const key = ['threads', false, ''];
      TanStackQueryService.prefetchInfiniteQuery(
        key,
        async () => {
          const res = await ThreadQueryServices.getThreads(-1);
          return res;
        },
        -1,
      );
    }
  }, [granted]);

  if (!granted) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{props.children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SyncProvider;
