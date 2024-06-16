package com.shambyte.receivers;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.content.ContentValues;
import android.net.Uri;

import com.facebook.react.HeadlessJsTaskService;
import com.shambyte.services.HeadlessSmsRecievedService;

public class SMSReceiver extends BroadcastReceiver {
    private static final String SMS_DELIVER = "android.provider.Telephony.SMS_DELIVER";
    @Override
    public void onReceive(Context context, Intent intent) {


        if (intent.getAction() != null && intent.getAction().equals(SMS_DELIVER)) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    for (Object pdu : pdus) {
                        SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                        String sender = smsMessage.getOriginatingAddress();
                        String messageBody = smsMessage.getMessageBody();
                        long timestamp = smsMessage.getTimestampMillis();
                        saveSmsToDatabase(context, sender, messageBody, timestamp);
                    }
                }
            }
        }
    }

    public static void saveSmsToDatabase(Context context, String sender, String message, long timestamp) {
        ContentValues values = new ContentValues();
        values.put("address", sender); // Sender's phone number
        values.put("body", message); // SMS message content
        values.put("date", timestamp); // Timestamp
        Uri uri = Uri.parse("content://sms/inbox"); // The URI for the SMS inbox
        Uri newUri = context.getContentResolver().insert(uri, values);
        Intent service = new Intent(context, HeadlessSmsRecievedService.class);
        Bundle newSMSBundle = new Bundle();
        newSMSBundle.putString("messageURI", newUri.toString());
        service.putExtras(newSMSBundle);
        context.startService(service);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
