import {initOutgoingCallN} from 'nativeModules';

export const handleCall = async (handle, num) => {
  try {
    const called = await initOutgoingCallN(handle, num);
  } catch (err) {
    console.log({err});
  }
};
