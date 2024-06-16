import {useCallback, useEffect, useState} from 'react';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {setIsAllPermissionGranted} from 'redux/sync-status';
import Platform from 'utils/platform';

export const appWidePermissions = {
  ios: {
    NSCameraUsageDescription: PERMISSIONS.IOS.CAMERA,
    NSContactsUsageDescription: PERMISSIONS.IOS.CONTACTS,
    NSFaceIDUsageDescription: PERMISSIONS.IOS.FACE_ID,
    NSLocationAlwaysAndWhenInUseUsageDescription:
      PERMISSIONS.IOS.LOCATION_ALWAYS,
    NSMicrophoneUsageDescription: PERMISSIONS.IOS.MICROPHONE,
    NSPhotoLibraryUsageDescription: PERMISSIONS.IOS.PHOTO_LIBRARY,
  },
  android: {
    // ACCESS_MEDIA_LOCATION: PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
    // ANSWER_PHONE_CALLS: PERMISSIONS.ANDROID.ANSWER_PHONE_CALLS,
    // CALL_PHONE: PERMISSIONS.ANDROID.CALL_PHONE,
    // CAMERA: PERMISSIONS.ANDROID.CAMERA,
    // GET_ACCOUNTS: PERMISSIONS.ANDROID.GET_ACCOUNTS,
    // POST_NOTIFICATIONS: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    // PROCESS_OUTGOING_CALLS: PERMISSIONS.ANDROID.PROCESS_OUTGOING_CALLS,
    // READ_CALL_LOG: PERMISSIONS.ANDROID.READ_CALL_LOG,
    READ_CONTACTS: PERMISSIONS.ANDROID.READ_CONTACTS,
    // READ_MEDIA_AUDIO: PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    // READ_MEDIA_IMAGES: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    // READ_MEDIA_VIDEO: PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
    READ_PHONE_NUMBERS: PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
    // CAMERA: PERMISSIONS.ANDROID.CAMERA,
    READ_PHONE_STATE: PERMISSIONS.ANDROID.READ_PHONE_STATE,
    READ_SMS: PERMISSIONS.ANDROID.READ_SMS,
    RECEIVE_MMS: PERMISSIONS.ANDROID.RECEIVE_MMS,
    RECEIVE_SMS: PERMISSIONS.ANDROID.RECEIVE_SMS,
    RECEIVE_WAP_PUSH: PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH,
    // RECORD_AUDIO: PERMISSIONS.ANDROID.RECORD_AUDIO,
    SEND_SMS: PERMISSIONS.ANDROID.SEND_SMS,
    // WRITE_CALL_LOG: PERMISSIONS.ANDROID.WRITE_CALL_LOG,
    WRITE_CONTACTS: PERMISSIONS.ANDROID.WRITE_CONTACTS,
    WRITE_EXTERNAL_STORAGE: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    READ_EXTERNAL_STORAGE: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    // ACCESS_BACKGROUND_LOCATION: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    // ACCESS_COARSE_LOCATION: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    // ACCESS_FINE_LOCATION: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  },
};

const PERMISSIONS_ARRAY = Platform.isIos
  ? Object.values(appWidePermissions.ios)
  : Object.values(appWidePermissions.android);

const usePermissions = (grantedDefaultSms, grantedDefaultDialer) => {
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();
  const setGranted = useCallback(
    granted => {
      dispatch(setIsAllPermissionGranted(granted));
    },
    [dispatch],
  );

  const requestPermission = useCallback(async p => {
    try {
      const result = await request(p);
      if (result === RESULTS.UNAVAILABLE) {
        return {permission: p, granted: false};
      } else if (result === RESULTS.GRANTED) {
        return {permission: p, granted: true};
      } else {
        return {permission: p, granted: false};
      }
    } catch (err) {
      // console.log(err, 'requestPermission');
    }
  }, []);

  const checkPermissions = useCallback(
    async p => {
      try {
        const result = await check(p);
        console.log({result});
        if (result === RESULTS.UNAVAILABLE) {
          return {permission: p, granted: false};
        } else if (result === RESULTS.GRANTED) {
          return {permission: p, granted: true};
        } else {
          const {permission, granted} = await requestPermission(p);
          return {permission, granted: granted};
        }
      } catch (err) {
        console.log('CHECK PERMISSION ERROR', err);
        return {permission: p, granted: false};
      }
    },
    [requestPermission],
  );

  const handlePermissions = useCallback(async () => {
    // console.log('handleing permissions');
    const _permissions = [];
    for (const p of PERMISSIONS_ARRAY) {
      const {permission, granted} = await checkPermissions(p);
      if (granted) {
        _permissions.push(permission);
      }
    }
    setPermissions([..._permissions]);
  }, [checkPermissions]);

  useEffect(() => {
    if (grantedDefaultSms && grantedDefaultDialer) {
      console.log('---------->GRANTED DEFAULT', {
        grantedDefaultDialer,
        grantedDefaultSms,
      });
      handlePermissions();
    }
  }, [grantedDefaultDialer, grantedDefaultSms, handlePermissions]);

  useEffect(() => {
    setGranted(permissions.length >= PERMISSIONS_ARRAY.length);
  }, [permissions.length, setGranted]);
};

export default usePermissions;
