import notifee, {EventType} from '@notifee/react-native';
import {Linking} from 'react-native';

export function setupNotificationListener() {
  const unsubscribe = notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      const link = detail.notification?.data?.link;
      console.log('Pressed notification with link:', link);
      if (link && typeof link === 'string') {
        // Use the link to navigate
        // This requires your navigation setup to be accessible here,
        // which might involve some global state management or context.
        Linking.openURL(link);
      }
    }
  });

  return unsubscribe;
}

export async function setupInitialNotification() {
  //
  try {
    const initialNoti = await notifee.getInitialNotification();
    if (initialNoti) {
      const link = initialNoti?.notification?.data?.link;

      if (link && typeof link === 'string') {
        // Use the link to navigate
        // This requires your navigation setup to be accessible here,
        // which might involve some global state management or context.
        link && Linking.openURL(link);
      }
    }
  } catch (error) {
    //
    console.log('Error getting initial notification:', error);
  }
}
