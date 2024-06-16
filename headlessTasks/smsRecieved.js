import {NativeSMSHandler} from 'nativeModules';
import notifee, {AndroidImportance} from '@notifee/react-native';
// import AISpamDetectionService from 'services/ai-spam-detection.services';
import {updateViewId} from 'redux/threads';
import {store} from 'redux/store';
import {AppState} from 'react-native';
import {screens} from 'constants/screens';

module.exports = async taskData => {
  try {
    const id = `${taskData.messageURI}`;
    const notification = `${taskData.notification}`;
    const sms = await NativeSMSHandler.getSMSbyURI(id);

    // AISpamDetectionService.detectSpam({
    //   text: sms?.body ?? '',
    //   sender: sms?.address ?? '',
    // });

    const isForeground = AppState.currentState === 'active';
    if (isForeground) {
      store?.dispatch(
        updateViewId({
          action: 'received',
          targets: [screens.APP.SMS, screens.APP.SMS_THREADS],
        }),
      );
    }

    if (notification === '0') {
      return;
    }

    const channelId = await notifee.createChannel({
      id: 'sms_notification_channel',
      name: 'sms',
      importance: AndroidImportance.HIGH,
    });

    const link = `shambyte://SMS_THREADS?phone_number=${sms.address}&thread_id=${sms.thread_id}`;
    // console.log('-----> SMS RECEIVED', link);

    await notifee.displayNotification({
      id: 'sms_notification',
      title: `<p style="color: #000000;"><b>${sms.address}</b></p>`,
      subtitle: '<p>Text Message</p>',
      body: `<p>${sms.body}</p>`,
      data: {
        link,
      },
      android: {
        channelId,
        color: '#c3c3c3',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        pressAction: {
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
    // NativeSMSHandler.playDefaultNotificationSound();
    //append it to thread as well and add last sms time to thread
  } catch (error) {
    // console.log({error, source: 'headlessTasks/smsRecieved'});
  }
};

// SMS_RECIEVED;
