import {KeyboardEventName, Platform as NativePlatform} from 'react-native';

const PLATFORM = NativePlatform.OS;
const isAndroid = PLATFORM === 'android';
const isIos = PLATFORM === 'ios';
const iosVersion = isIos ? NativePlatform.Version : 0;
const KeyboardEvent: Record<string, KeyboardEventName> = {
  Show: isIos ? 'keyboardWillShow' : 'keyboardDidShow',
  Hide: isIos ? 'keyboardWillHide' : 'keyboardDidHide',
};
const androidAPILevel = isAndroid ? NativePlatform.Version : 0;
const isSupportTranslucentBar = isIos || +androidAPILevel >= 21;
const ConnectionEvent = 'connectionChange';

const isDev = !!__DEV__;
const isProduction = !isDev;

const Platform = {
  ConnectionEvent,
  iosVersion,
  isAndroid,
  isDev,
  isIos,
  isProduction,
  KeyboardEvent,
  OS: PLATFORM,
  isSupportTranslucentBar,
  androidAPILevel,
};

export default Platform;
