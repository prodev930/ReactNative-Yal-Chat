package com.shambyte.nativeModules;

import static com.shambyte.helpers.ThreadHelperKt.*;
import static com.shambyte.helpers.SmsHelperKt.*;


import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.role.RoleManager;
import android.content.ContentProviderOperation;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.provider.ContactsContract;
import android.content.OperationApplicationException;
import android.database.Cursor;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;
import android.provider.Telephony;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.shambyte.activities.ComposeSmsActivity;
import com.shambyte.services.HeadlessSmsRecievedService;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class NativeSMSHandler extends ReactContextBaseJavaModule {
    private static String fetchAllSmsTillId = "";
    private static final String MODULE_NAME = "NativeSMSHandler";
    private static final String SMS_READ_FROM_DEVICE = "SMS_READ_FROM_DEVICE";
    private static final String THREAD_READ_FROM_DEVICE = "THREAD_READ_FROM_DEVICE";
    private static final String ALL_THREADS_READ_FROM_DEVICE = "ALL_THREADS_READ_FROM_DEVICE";
    // private static final int SEND_SMS_REQUEST_CODE = "SHAMBYTE_SEND_SMS_REQUEST_CODE".hashCode() & 0xffff;
    private static final Uri SMS_URI = Telephony.Sms.CONTENT_URI;
    private static final Uri CONTACT_URI = ContactsContract.CommonDataKinds.Phone.CONTENT_URI;
    private final Context context;

    public NativeSMSHandler(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getAllSms() {
        NativeSMSHandler.EmitSMSExecutor executorService = new NativeSMSHandler.EmitSMSExecutor();
        executorService.emitSMSAsync();
    }

    @ReactMethod
    public void getSMSbyURI(String u, Promise promise) {
        Uri uri = Uri.parse(u);
        ContentResolver contentResolver = context.getContentResolver();
        Cursor cursor = contentResolver.query(uri, null, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            do {
                WritableMap sms = Arguments.createMap();
                for (int i = 0; i < cursor.getColumnCount(); i++) {
                    String columnName = cursor.getColumnName(i);
                    String columnValue = cursor.getString(i);
                    sms.putString(columnName, columnValue);
                }
                promise.resolve(sms);
            } while (cursor.moveToNext());
            cursor.close();
        }
    }

    @ReactMethod
    public void getSMSbyThreadId(int threadId, int cursorId, int limit, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        asyncGetSMSsInAThread(contentResolver, promise, threadId, cursorId, limit);
    }

    @ReactMethod
    public void searchThreadsByKeyword(String keyword, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        asyncSearchThreads(contentResolver, promise, keyword);
    }

    @ReactMethod
    public void deleteThreads(ReadableArray threadIds, Promise promise) {
        try {
            Long[] threadIdsArray = new Long[threadIds.size()];
            for (int i = 0; i < threadIds.size(); i++) {
                threadIdsArray[i] = (long) threadIds.getInt(i);
            }

            int result = deleteSmsThreads(context, threadIdsArray);
            promise.resolve(result);
        } catch (Exception e) {
            Log.e("YAL_SMS", "Error", e);
            promise.reject("Error", e.getMessage());
        }
    }

    @ReactMethod
    public void getThreadIdByPhoneNumber(String phoneNumber, Promise promise) {
            ContentResolver contentResolver = context.getContentResolver();
            asyncGetThreadIdFromNumber(contentResolver, promise, phoneNumber);
    }

    @ReactMethod
    public void markThreadAsRead(int threadId, Promise promise) {
        try {
            ContentResolver contentResolver = context.getContentResolver();
            int rowUpdated = markSmsAsReadInThread(contentResolver, threadId);
            promise.resolve(rowUpdated > 0);
        } catch (Exception e) {
            Log.e("YAL_SMS", "Error markThreadAsRead", e);
            promise.reject("Error", e.getMessage());
        }
    }

    @ReactMethod
    public void getThreads(int limit, int cursorId, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        asyncGetThreadsPagination(contentResolver, promise, limit, cursorId);
    }

    @ReactMethod
    public void getAllSmsTillId(String id) {
        fetchAllSmsTillId = id;
        NativeSMSHandler.EmitSMSTillIdExecutor executorService = new NativeSMSHandler.EmitSMSTillIdExecutor();
        executorService.emitSMSTillIdAsync();
    }

    @ReactMethod
    public void getLastSMS(Promise promise) {
        Uri uri = Uri.parse("content://sms");
        ContentResolver contentResolver = context.getContentResolver();
        Cursor cursor = contentResolver.query(uri, null, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            try {
                WritableMap sms = Arguments.createMap();
                for (int i = 0; i < cursor.getColumnCount(); i++) {
                    String columnName = cursor.getColumnName(i);
                    String columnValue = cursor.getString(i);
                    sms.putString(columnName, columnValue);
                }
                promise.resolve(sms);
            } finally {
                cursor.close();
            }
        } else {
            promise.resolve("no sms exists");
        }
    }

    @ReactMethod
    public void getAllThreads() {
        NativeSMSHandler.EmitThreadExecutor executorService = new NativeSMSHandler.EmitThreadExecutor();
        executorService.emitThreadAsync();
    }

    @ReactMethod
    public void getAllThreads2() {
        NativeSMSHandler.EmitThreadExecutor executorService = new NativeSMSHandler.EmitThreadExecutor();
        executorService.emitAllThreadsAsync();
    }

    @ReactMethod
    public void sendSms(String recipient, String message, Promise promise) {
//        Activity currentActivity = getCurrentActivity();
//        if (currentActivity != null) {
//            Intent intent = new Intent(currentActivity, ComposeSmsActivity.class);
//            intent.putExtra("recipient", recipient);
//            intent.putExtra("message", message);
//            currentActivity.startActivityForResult(intent, SEND_SMS_REQUEST_CODE);
//        }
//        promise.resolve(true);
        sendSmsAsync(context, promise, recipient, message);
    }

    @ReactMethod
    public void setDefault(Promise promise) {
        RoleManager roleManager = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            roleManager = getCurrentActivity().getSystemService(RoleManager.class);
        } else {
            promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this version.");
        }
        if (roleManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                if (roleManager.isRoleAvailable(RoleManager.ROLE_SMS)) {
                    Intent roleRequestIntent = roleManager.createRequestRoleIntent(RoleManager.ROLE_SMS);
                    getCurrentActivity().startActivityForResult(roleRequestIntent, 0);
//                    getCurrentActivity().finish();
                    promise.resolve(true);
                } else {
                    promise.reject("ROLE_NOT_AVAILABLE", "The SMS role is not available on this device.");
                }
            } else {
                promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this version.");
            }
        } else {
            promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this device.");
        }
    }

    @ReactMethod
    public void deleteSmsByIds(ReadableArray messageIds, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        ArrayList<ContentProviderOperation> operations =
                new ArrayList<>();
        for (int i = 0; i < messageIds.size(); i++) {
            operations.add(ContentProviderOperation.newDelete(
                    Uri.parse("content://sms/" + messageIds.getInt(i))
            ).build());
        }
        ;
        try {
            contentResolver.applyBatch("sms", operations); // May also try "mms-sms" in place of "sms"
            promise.resolve(true);
        } catch (OperationApplicationException e) {
            // Handle the error
            promise.resolve(false);
        } catch (RemoteException e) {
            // Handle the error
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void deleteThreadsByIds(ReadableArray threadIds, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        ArrayList<ContentProviderOperation> operations = new ArrayList<>();
        for (int i = 0; i < threadIds.size(); i++) {
            Uri threadUri = Uri.withAppendedPath(Telephony.Sms.CONTENT_URI, String.valueOf(threadIds.getInt(i)));
            operations.add(ContentProviderOperation.newDelete(threadUri).build());
        }
        try {
            contentResolver.applyBatch(Telephony.Sms.CONTENT_URI.getAuthority(), operations);
            promise.resolve(true);
        } catch (OperationApplicationException | RemoteException e) {
            // Handle the error more precisely
            e.printStackTrace(); // Log the exception for debugging
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void markSmsAsReadByIds(ReadableArray messageIds, Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        // Define the URI for the SMS inbox
        Uri uri = Uri.parse("content://sms/inbox");
        // Define the selection criteria for multiple IDs
        String selection = Telephony.Sms._ID + " IN (";
        for (int i = 0; i < messageIds.size(); i++) {
            selection += messageIds.getInt(i);
            if (i < messageIds.size() - 1) {
                selection += ",";
            }
        }
        selection += ")";
        // Query the SMS Content Provider for the specified messages
        Cursor cursor = contentResolver.query(uri, null, selection, null, null);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                // Retrieve the read status of each message
                @SuppressLint("Range") int readStatus = cursor.getInt(cursor.getColumnIndexOrThrow(Telephony.Sms.READ));
                @SuppressLint("Range") int seenStatus = cursor.getInt(cursor.getColumnIndexOrThrow(Telephony.Sms.SEEN));

                // Check if the message is not already marked as read
                if (readStatus == 0 || seenStatus == 0) {
                    // Get the message ID
                    @SuppressLint("Range") long messageId = cursor.getLong(cursor.getColumnIndexOrThrow(Telephony.Sms._ID));
                    // Update the message's read and seen status
                    ContentValues values = new ContentValues();
                    values.put(Telephony.Sms.READ, 1); // 1 means read, 0 means unread
                    values.put(Telephony.Sms.SEEN, 1); // 1 means read, 0 means unread
                    // Update the message using the Content Resolver
                    contentResolver.update(uri, values, Telephony.Sms._ID + "=?", new String[]{String.valueOf(messageId)});
                }
            }
            cursor.close();
            promise.resolve(true);
        } else {
            promise.reject("unable to mark as read");
        }
    }

    @ReactMethod
    private void playDefaultNotificationSound() {
        // Get the default notification sound URI
        Uri notificationSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        // Create a Ringtone object using the URI
        Ringtone ringtone = RingtoneManager.getRingtone(context, notificationSoundUri);
        // Play the default notification sound
        ringtone.play();
    }

    @ReactMethod
    private void generateDummySMSentry(String sender) {
        Instant now = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            now = Instant.now();
        }
        // Convert the timestamp to milliseconds
        long timestamp = 0;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            timestamp = now.toEpochMilli();
        }
        ContentValues values = new ContentValues();
        values.put("address", sender); // Sender's phone number
        values.put("body", ""); // SMS message content
        values.put("date", timestamp); // Timestamp
        values.put("seen", 0); // seen
        values.put("read", 0); // read
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

    public class EmitSMSTillIdExecutor {
        private ExecutorService executorService;

        public EmitSMSTillIdExecutor() {
            executorService = Executors.newSingleThreadExecutor();
        }

        public void emitSMSTillIdAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new NativeSMSHandler.EmitSMSTillIdExecutor.EmitSMSTillIdTask());
        }

        private class EmitSMSTillIdTask implements Runnable {
            @Override
            public void run() {
                Uri uri = Uri.parse("content://sms");
                ContentResolver contentResolver = context.getContentResolver();
                Cursor cursor = contentResolver.query(uri, null, null, null, null);
                if (cursor != null && cursor.moveToFirst()) {
                    do {
                        WritableMap sms = Arguments.createMap();
                        for (int i = 0; i < cursor.getColumnCount(); i++) {
                            String columnName = cursor.getColumnName(i);
                            String columnValue = cursor.getString(i);
                            sms.putString(columnName, columnValue);

                        }
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(SMS_READ_FROM_DEVICE, sms.toString());
                        if (sms.getString("_id").equalsIgnoreCase(fetchAllSmsTillId)) {
                            getReactApplicationContext()
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("SMS_SYNC_DONE", true);
                            cursor.close();
                        }
                    } while (cursor.moveToNext());
                }
            }
        }
    }

    public class EmitSMSExecutor {
        private ExecutorService executorService;

        public EmitSMSExecutor() {
            executorService = Executors.newSingleThreadExecutor();
        }

        public void emitSMSAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new NativeSMSHandler.EmitSMSExecutor.EmitSMSTask());
        }

        private class EmitSMSTask implements Runnable {
            @Override
            public void run() {
                Uri uri = Uri.parse("content://sms");
                ContentResolver contentResolver = context.getContentResolver();
                Cursor cursor = contentResolver.query(uri, null, null, null, null);
                if (cursor != null && cursor.moveToFirst()) {
                    int j = 0;
                    do {
                        WritableMap sms = Arguments.createMap();
                        for (int i = 0; i < cursor.getColumnCount(); i++) {
                            String columnName = cursor.getColumnName(i);
                            String columnValue = cursor.getString(i);
                            sms.putString(columnName, columnValue);
                        }
                        j++;
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(SMS_READ_FROM_DEVICE, sms.toString());
                    } while (cursor.moveToNext() && j < 100);
                    cursor.close();
                    getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("SMS_SYNC_DONE", true);

                }
            }
        }
    }

    public class EmitThreadExecutor {
        private ExecutorService executorService;

        public EmitThreadExecutor() {
            executorService = Executors.newSingleThreadExecutor();
        }

        public void emitThreadAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new NativeSMSHandler.EmitThreadExecutor.EmitThreadTask());
        }

        public void emitAllThreadsAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new NativeSMSHandler.EmitThreadExecutor.EmitAllThreadsTask());
        }

        private class EmitThreadTask implements Runnable {
            @Override
            public void run() {
                Uri uri = Uri.parse("content://sms/conversations");
                ContentResolver contentResolver = context.getContentResolver();
                Cursor cursor = contentResolver.query(uri, null, null, null, null);
                if (cursor != null && cursor.moveToFirst()) {
                    do {
                        WritableMap thread = Arguments.createMap();
                        for (int i = 0; i < cursor.getColumnCount(); i++) {
                            String columnName = cursor.getColumnName(i);
                            String columnValue = cursor.getString(i);
                            thread.putString(columnName, columnValue);
                        }
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(THREAD_READ_FROM_DEVICE, thread.toString());
                    } while (cursor.moveToNext());
                    cursor.close();
                    getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("THREAD_SYNC_DONE", true);
                }
            }
        }

        private class EmitAllThreadsTask implements Runnable {
            @Override
            public void run() {
                Uri uri = Telephony.Sms.Conversations.CONTENT_URI;
                ContentResolver contentResolver = context.getContentResolver();
                String[] projection = {"thread_id", Telephony.Sms.Conversations.SNIPPET,};
                String sortOrder = Telephony.Sms.Conversations.DEFAULT_SORT_ORDER + " LIMIT 500";
                Cursor cursor = contentResolver.query(uri, projection, null, null, sortOrder);
                WritableArray threadArray = Arguments.createArray();
                if (cursor != null && cursor.moveToFirst()) {
                    do {
                        int threadIndex = cursor.getColumnIndex("thread_id");
                        long threadId = (threadIndex >= 0) ? cursor.getLong(threadIndex) : 0;

                        int snippetIndex = cursor.getColumnIndex(Telephony.Sms.Conversations.SNIPPET);
                        String snippet = (snippetIndex >= 0) ? cursor.getString(snippetIndex) : null;
                        String phoneNumber = getPhoneNumber(contentResolver, threadId);
                        WritableArray contacts = phoneNumber != null ? getContactByPhoneNumber(contentResolver, phoneNumber) : Arguments.createArray();
                        ;
                        String contactName = contacts.size() > 0 ? contacts.getMap(0).getString(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME) : phoneNumber;
                        long date = getDate(contentResolver, threadId);
                        WritableMap map = Arguments.createMap();
                        map.putDouble("thread_id", threadId);
                        map.putString("snippet", snippet);
                        map.putDouble("date", date);
                        map.putArray("contacts", contacts);
                        map.putString("contactName", contactName);
                        map.putString("phoneNumber", phoneNumber);
                        threadArray.pushMap(map);

                    } while (cursor.moveToNext());
                    cursor.close();
                }


                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("ALL_THREADS_SYNC_DONE", threadArray.toString());
            }
        }
    }
}
