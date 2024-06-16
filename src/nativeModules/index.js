import {NativeModules} from 'react-native';
export const {NativeSMSHandler, RecentCallsNativeModule, AIModelNativeModule} =
  NativeModules;

export const {
  setDefaultDialerN,
  getPhoneAccountHandlesN,
  getCallingNumberN,
  acceptN,
  rejectN,
  getDurationN,
  toggleHoldN,
  toggleSpeakerPhoneN,
  toggleMuteN,
  getAllCallsN,
  swapN,
  mergeN,
  getStateN,
  keypadN,
  getCallAudioRouteN,
  getSupportedAudioRoutesN,
  setAudioRouteN,
  initOutgoingCallN,
  toggleRingingN,
  acquireWakeLock,
  releaseWakeLock,
} = NativeModules.CallNativeModule;
