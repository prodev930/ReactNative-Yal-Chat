import {IMessage} from 'react-native-gifted-chat';
import {SMSType} from 'services/sms-query.services';

export function convertSMSToGiftedChatData(sms: SMSType) {
  return {
    _id: sms._id,
    text: sms.body,
    createdAt: sms.date,
    sent: sms.type === 2,
    received: sms.type === 1,
    user: {
      _id: sms.type === 2 ? 2 : sms.person,
      name: sms.type === 2 ? 'you' : sms.address,
    },
  } as IMessage;
}
