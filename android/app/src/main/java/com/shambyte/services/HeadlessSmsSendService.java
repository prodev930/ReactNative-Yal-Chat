package com.shambyte.services;
import android.app.IntentService;
import android.content.Intent;
import android.telephony.SmsManager;

public class HeadlessSmsSendService extends IntentService {
    public HeadlessSmsSendService() {
        super("HeadlessSmsSendService");
    }
    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            String phoneNumber = intent.getStringExtra("phoneNumber");
            String message = intent.getStringExtra("message");
            if (phoneNumber != null && message != null) {
                sendSms(phoneNumber, message);
            }
        }
    }
    private void sendSms(String phoneNumber, String message) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, message, null, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
