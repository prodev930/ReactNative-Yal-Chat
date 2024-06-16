package com.shambyte.services

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.telecom.Call
import android.telecom.CallAudioState
import android.telecom.CallEndpoint
import android.telecom.InCallService
import android.util.Log
import androidx.annotation.RequiresApi
import com.shambyte.extensions.isOutgoing
import com.shambyte.extensions.powerManager
import com.shambyte.helpers.CallManager
import com.shambyte.helpers.NoCall
import java.net.URLDecoder

@RequiresApi(Build.VERSION_CODES.M)
class CallService() : InCallService() {

    private val SHOW_CALL_NOTIFICATION = "SHOW_CALL_NOTIFICATION"
    private val REMOVE_CALL_NOTIFICATION = "REMOVE_CALL_NOTIFICATION"
    private val availableEndpoints = mutableListOf<CallEndpoint>();


    private val callListener = object : Call.Callback() {

        override fun onStateChanged(call: Call, state: Int) {
            super.onStateChanged(call, state)
            if (state !== Call.STATE_RINGING ) {
                launchHeadlessCallServiceTask(REMOVE_CALL_NOTIFICATION)
//                callNotificationManager.cancelNotification()
            } else if (state == Call.STATE_RINGING ) {
                launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
//                callNotificationManager.setupNotification()
            }
        }
    }

    override fun onAvailableCallEndpointsChanged(availableEndpoints: MutableList<CallEndpoint>) {
        super.onAvailableCallEndpointsChanged(availableEndpoints)
        this.availableEndpoints.clear()
        Log.d("SHAMBYTE_AUDIO", "Available endpoints changed: ${availableEndpoints.toString()}")
        this.availableEndpoints.addAll(availableEndpoints)
    }

    fun getAvailableEndpoints(): MutableList<CallEndpoint> {
        return availableEndpoints
    }

    override fun onCallAdded(call: Call) {
        super.onCallAdded(call)
        CallManager.onCallAdded(call)
        CallManager.inCallService = this
        call.registerCallback(callListener)

        val isScreenLocked = (getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager).isDeviceLocked
        if (!powerManager.isInteractive || call.isOutgoing() || isScreenLocked) {
            try {
//                callNotificationManager.setupNotification(true)
                launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
            } catch (e: Exception) {
                // seems like startActivity can throw AndroidRuntimeException and ActivityNotFoundException, not yet sure when and why, lets show a notification
                launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
            }
        } else {
//            callNotificationManager.setupNotification()
            launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
        }
    }

    override fun onCallRemoved(call: Call) {
        super.onCallRemoved(call)
        call.unregisterCallback(callListener)
        val wasPrimaryCall = call == CallManager.getPrimaryCall()
        CallManager.onCallRemoved(call)
        if (CallManager.getPhoneState() == NoCall) {
            CallManager.inCallService = null
            launchHeadlessCallServiceTask(REMOVE_CALL_NOTIFICATION)
        } else {
            launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
//            callNotificationManager.setupNotification()
            if (wasPrimaryCall) {
                //launch Activity
                launchHeadlessCallServiceTask(SHOW_CALL_NOTIFICATION)
            }
        }
    }

    override fun onCallAudioStateChanged(audioState: CallAudioState?) {
        super.onCallAudioStateChanged(audioState)
        if (audioState != null) {
            CallManager.onAudioStateChanged(audioState)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        launchHeadlessCallServiceTask(REMOVE_CALL_NOTIFICATION)
    }

    private fun launchHeadlessCallServiceTask (action:String) {
        val service = Intent(applicationContext, CallHeadlessTaskService::class.java)
        val bundle = Bundle()
        bundle.putString("action", action)
        bundle.putString("phoneNumber", URLDecoder.decode(CallManager.getPrimaryCall()?.details?.handle.toString(),"UTF-8").replace(Regex("[^0-9+]"), ""))
        service.putExtras(bundle)
        applicationContext.startService(service)
    }
}
