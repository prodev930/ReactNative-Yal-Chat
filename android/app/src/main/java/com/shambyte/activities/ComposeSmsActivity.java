package com.shambyte.activities;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.HeadlessJsTaskService;
import com.shambyte.services.HeadlessSmsRecievedService;

import java.net.URLDecoder;
import java.time.Instant;

public class ComposeSmsActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        String recipient = intent.getStringExtra("recipient");
        String message = intent.getStringExtra("message");
        String action = intent.getAction();
        String data = intent.getDataString();
        Log.d("Bundle Debug", "action of intent - " + action);
        Log.d("Bundle Debug", "data of intent - " + data);
        if (action != null && data != null){
            String url = "shambyte://SMS_THREADS/"+ URLDecoder.decode(data).replaceAll("[^+0-9]", "");
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setData(Uri.parse(url));
            startActivity(i);
        } else if (recipient != null && message != null) {
            sendSms(recipient, message);
        } else {
            Toast.makeText(getApplicationContext(), "Recipient and message cannot be empty", Toast.LENGTH_SHORT).show();
        }
        // Finish the activity.
        finish();
    }

    private void sendSms(String recipient, String message) {
        try {
            Instant now = Instant.now();
            // Convert the timestamp to milliseconds
            long timestamp = now.toEpochMilli();
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(recipient, null, message, null, null);
            saveSmsToDatabase(getApplicationContext(), recipient, message, timestamp);
            Toast.makeText(getApplicationContext(), "SMS sent successfully", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(getApplicationContext(), "SMS sending failed", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
    }

    public static void saveSmsToDatabase(Context context, String sender, String message, long timestamp) {
        ContentValues values = new ContentValues();
        values.put("address", sender); // Sender's phone number
        values.put("body", message); // SMS message content
        values.put("date", timestamp); // Timestamp
        values.put("seen", 1); // seen
        values.put("read", 1); // read
        values.put("type", "2"); // type
        Uri uri = Uri.parse("content://sms/inbox"); // The URI for the SMS inbox
        Uri newUri = context.getContentResolver().insert(uri, values);
        Intent service = new Intent(context, HeadlessSmsRecievedService.class);
        Bundle newSMSBundle = new Bundle();
        newSMSBundle.putString("messageURI", newUri.toString());
        newSMSBundle.putString("notification", "0");
        service.putExtras(newSMSBundle);
        context.startService(service);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }

}
