package com.shambyte.helpers

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.telephony.SmsManager
import android.util.Log
import android.widget.Toast
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Promise
import com.shambyte.services.HeadlessSmsRecievedService
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


@Suppress("DEPRECATION")
fun sendSmsDirectly(context: Context, phoneNumber: String, message: String) {
    val smsManager = SmsManager.getDefault();
    smsManager.sendTextMessage(phoneNumber, null, message, null, null)
    val timestamp = System.currentTimeMillis()
    saveSmsToDatabase(context, phoneNumber, message, timestamp)
}

fun toastAsync(context: Context,message: String) {
    val errorHandler = CoroutineExceptionHandler() { _, exception ->
        Log.e("SmsHelper", "Error toastAsync: ${exception.localizedMessage}", exception)
    }

    CoroutineScope(Dispatchers.Main + errorHandler).launch {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}

fun saveSmsToDatabase(context: Context, sender: String?, message: String?, timestamp: Long) {
    val values = ContentValues().apply {
        put("address", sender) // Sender's phone number
        put("body", message) // SMS message content
        put("date", timestamp) // Timestamp
        put("seen", 1) // seen
        put("read", 1) // read
        put("type", "2") // type
    }
    val uri = Uri.parse("content://sms/sent") // The URI for the SMS Sent
    val newUri = context.contentResolver.insert(uri, values)
    val service = Intent(context, HeadlessSmsRecievedService::class.java)
    val newSMSBundle = Bundle()
    newSMSBundle.putString("messageURI", newUri.toString())
    newSMSBundle.putString("notification", "0")
    service.putExtras(newSMSBundle)
    context.startService(service)
    HeadlessJsTaskService.acquireWakeLockNow(context)
}

fun sendSmsAsync(context: Context, promise: Promise, phoneNumber: String, message: String) {
    val errorHandler = CoroutineExceptionHandler() { _, exception ->
        Log.e("SmsHelper", "Error sendSmsDirectly: ${exception.localizedMessage}", exception)
        promise.reject(exception)
    }

    CoroutineScope(Dispatchers.IO + errorHandler).launch {
        sendSmsDirectly(context, phoneNumber, message)
        promise.resolve(true)
        toastAsync(context, "SMS sent successfully")
    }
}
