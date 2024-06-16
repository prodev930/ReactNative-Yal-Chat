package com.shambyte.nativeModules;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class RecentCallsNativeModule extends ReactContextBaseJavaModule {
    private static String fetchRecentCallsTillId = "";
    Uri callLogUri = CallLog.Calls.CONTENT_URI;
    private static final String MODULE_NAME = "RecentCallsNativeModule";
    private static final String RECENT_CALL_READ_FROM_DEVICE = "RECENT_CALL_READ_FROM_DEVICE";
    private static final String RECENT_CALL_READ_FROM_DEVICE_DONE = "RECENT_CALL_READ_FROM_DEVICE_DONE";
    private ReactApplicationContext context;



    public  RecentCallsNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;

    }


    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getRecentCalls() {

        RecentCallsNativeModule.EmitRecentCallsExecutor executorService = new RecentCallsNativeModule.EmitRecentCallsExecutor();
        executorService.emitRecentCallsAsync();
    }
    @ReactMethod
    public void getLastRecentCall(Promise promise) {
        ContentResolver contentResolver = context.getContentResolver();
        Cursor cursor = contentResolver.query(callLogUri, null, null, null, "date DESC");
        if (cursor != null && cursor.moveToFirst()) {
            try {
                WritableMap log = Arguments.createMap();
                for (int i = 0; i < cursor.getColumnCount(); i++) {
                    String columnName = cursor.getColumnName(i);
                    String columnValue = cursor.getString(i);
                    log.putString(columnName, columnValue);
                }
                promise.resolve(log);
            } finally {
                cursor.close();
            }
        } else {
            promise.resolve("no sms exists");
        }
    }

    @ReactMethod
    public void getRecentCallsTillId(String id) {
        fetchRecentCallsTillId = id;
        RecentCallsNativeModule.EmitRecentCallsTillIdExecutor executorService = new RecentCallsNativeModule.EmitRecentCallsTillIdExecutor();
        executorService.emitRecentCallsTillIdAsync();
    }

    public class EmitRecentCallsTillIdExecutor {
        private ExecutorService executorService;
        public EmitRecentCallsTillIdExecutor() {
            executorService = Executors.newSingleThreadExecutor();
        }
        public void emitRecentCallsTillIdAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new RecentCallsNativeModule.EmitRecentCallsTillIdExecutor.EmitRecentCallsTillIdTask());
        }
        private class EmitRecentCallsTillIdTask implements Runnable {
            @Override
            public void run() {
                ContentResolver contentResolver = context.getContentResolver();
                Cursor cursor = contentResolver.query(callLogUri, null, null, null, "date DESC");
                if (cursor != null && cursor.moveToFirst()) {
                    do {
                        WritableMap log = Arguments.createMap();
                        for (int i = 0; i < cursor.getColumnCount(); i++) {
                            String columnName = cursor.getColumnName(i);
                            String columnValue = cursor.getString(i);
                            log.putString(columnName, columnValue);

                        }
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(RECENT_CALL_READ_FROM_DEVICE, log.toString());
                        if (log.getString("_id").equalsIgnoreCase(fetchRecentCallsTillId)) {
                            getReactApplicationContext()
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit(RECENT_CALL_READ_FROM_DEVICE_DONE, true);
                            cursor.close();
                        }
                    } while(cursor.moveToNext());
                }
            }
        }
    }

    public class EmitRecentCallsExecutor {
        private ExecutorService executorService;
        public EmitRecentCallsExecutor() {
            executorService = Executors.newSingleThreadExecutor();
        }
        public void emitRecentCallsAsync() {
            Future<Void> future = (Future<Void>) executorService.submit(new RecentCallsNativeModule.EmitRecentCallsExecutor.EmitRecentCallsTask());
        }
        private class EmitRecentCallsTask implements Runnable {
            @Override
            public void run() {

                ContentResolver contentResolver = context.getContentResolver();
                Cursor cursor = contentResolver.query(callLogUri, null, null, null,"date DESC");
                if (cursor != null && cursor.moveToFirst()) {
                    int j = 0;
                    do {
                        WritableMap log = Arguments.createMap();
                        for (int i = 0; i < cursor.getColumnCount(); i++) {
                            String columnName = cursor.getColumnName(i);
                            String columnValue = cursor.getString(i);
                            log.putString(columnName, columnValue);
                                Log.d("CallLog" , columnName + columnValue );
                               
                        }
                        j++;
                        getReactApplicationContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(RECENT_CALL_READ_FROM_DEVICE, log.toString());
                    } while (cursor.moveToNext() && j<50);
                    cursor.close();
                    getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(RECENT_CALL_READ_FROM_DEVICE_DONE, true);

                }
            }
        }
    }





}
