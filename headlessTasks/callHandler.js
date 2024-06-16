import notifee, {
  AndroidCategory,
  AndroidImportance,
} from '@notifee/react-native';
import {ContactQueries} from 'database/models/Contacts/Contacts.queries';
import {
  acquireWakeLock,
  rejectN,
  releaseWakeLock,
  toggleRingingN,
} from 'nativeModules';
import {Linking} from 'react-native';
import {splitNumber} from 'utils/utilities';

module.exports = async ({action, phoneNumber}) => {
  const channelId = await notifee.createChannel({
    id: 'call_notification_channel',
    name: 'Call',
    importance: AndroidImportance.HIGH,
  });
  try {
    switch (action) {
      case 'SHOW_CALL_NOTIFICATION':
        acquireWakeLock();
        Linking.openURL('shambyte://DIAL/ringing');
        toggleRingingN('play');
        const contact = await ContactQueries.searchContacts(
          splitNumber(phoneNumber).phoneNumber,
        );
        const callerName =
          contact && contact.length ? contact[0].displayName : phoneNumber;
        if (contact && contact.length && contact[0].isBlocked) {
          rejectN();
        }
        await notifee.displayNotification({
          id: 'call_notification',
          title:
            '<p style="color: #000000;"><b>Incoming Call</span></p></b></p>',
          subtitle: '',
          body: `<p>${callerName}</p>`,

          android: {
            channelId,
            color: '#c3c3c3',
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.CALL,
            pressAction: {
              id: 'default',
            },
            fullScreenAction: {
              id: 'default',
            },
            // actions: [
            //   {
            //     title: '<p style="color: #4caf50;"><b>Answer</b></p>',
            //     pressAction: {id: 'answer'},
            //   },
            //   {
            //     title: '<p style="color: #f44336;"><b>Reject</b></p>',
            //     pressAction: {id: 'reject'},
            //   },
            // ],
          },
        });
        break;
      case 'REMOVE_CALL_NOTIFICATION':
        toggleRingingN('pause');
        notifee.cancelDisplayedNotifications();
        releaseWakeLock();
        break;
      case 'UPDATE_ONGOING_CALL_NOTIFICATION':
        // console.log(action);
        break;
      case 'REJECT_CALL':
        // console.log(action);
        break;
      case 'END_CALL':
        // console.log(action);
        break;
      case 'CALL_SPEAKER_ON':
        // console.log(action);
        break;
      case 'CALL_SPEAKER_OFF':
        // console.log(action);
        break;
      default:
        // console.log(action);
        break;
    }
  } catch (error) {
    console.log({error, source: 'headlessTasks/callHandler'});
  }
};
