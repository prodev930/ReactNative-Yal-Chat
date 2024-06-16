const {smsChannels} = require('constants/smsChannels');
const {SMSQueries} = require('database/models/SMS/SMS.queries');
const {threadQueries} = require('database/models/Threads/Threads.queries');
const {NativeSMSHandler} = require('nativeModules');

module.exports = async taskData => {
  try {
    const id = `${taskData.messageURI}`;
    const sms = await NativeSMSHandler.getSMSbyURI(id);
    const addedSms = await SMSQueries.addSMS({
      ...sms,
      id: sms._id,
      date: sms.date,
      channel: smsChannels.text,
    });
    threadQueries.addThread(addedSms);
    //append it to thread as well and add last sms time to thread
  } catch (error) {
    // console.log({error, source: 'headlessTasks/smsSent'});
  }
};
