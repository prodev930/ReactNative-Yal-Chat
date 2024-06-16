package com.shambyte.nativeModules

import android.Manifest
import android.annotation.SuppressLint
import android.app.role.RoleManager
import android.content.Context
import android.content.pm.PackageManager
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.telecom.PhoneAccount
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat.getSystemService
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shambyte.extensions.getCallDuration
import com.shambyte.helpers.CallManager.Companion.accept
import com.shambyte.helpers.CallManager.Companion.changeCallAudioRoute2
import com.shambyte.helpers.CallManager.Companion.getAllCalls
import com.shambyte.helpers.CallManager.Companion.getCallAudioRoute
import com.shambyte.helpers.CallManager.Companion.getPrimaryCall
import com.shambyte.helpers.CallManager.Companion.getState
import com.shambyte.helpers.CallManager.Companion.getSupportedAudioRoutes
import com.shambyte.helpers.CallManager.Companion.keypad
import com.shambyte.helpers.CallManager.Companion.merge
import com.shambyte.helpers.CallManager.Companion.reject
import com.shambyte.helpers.CallManager.Companion.setAudioRoute
import com.shambyte.helpers.CallManager.Companion.swap
import com.shambyte.helpers.CallManager.Companion.toggleHold
import com.shambyte.helpers.CallManager.Companion.toggleMute
import com.th3rdwave.safeareacontext.getReactContext
import java.net.URI
import java.net.URLDecoder

class CallNativeModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    val context = reactContext
    val telecomManager = context.getSystemService(ReactApplicationContext.TELECOM_SERVICE) as TelecomManager
    private val ringtone: Ringtone
    private var wakeLock: PowerManager.WakeLock? = null

    init {
        val ringtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
        ringtone = RingtoneManager.getRingtone(context, ringtoneUri)

    }


    override fun getName() = "CallNativeModule"

    @ReactMethod
    fun setDefaultDialerN(promise: Promise) {
        var roleManager: RoleManager? = null
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            roleManager = currentActivity?.getSystemService(RoleManager::class.java)
        } else {
            promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this version.")
            return
        }
        System.out.println("roleManager: $roleManager")
        if (roleManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                if (roleManager.isRoleAvailable(RoleManager.ROLE_DIALER)) {
                    val roleRequestIntent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER)
                    currentActivity?.startActivityForResult(roleRequestIntent, 0)
                    promise.resolve(true)
                } else {
                    promise.reject("ROLE_NOT_AVAILABLE", "The Dialer role is not available on this device.")
                }
            } else {
                promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this version.")
            }
        } else {
            promise.reject("ROLE_MANAGER_UNAVAILABLE", "RoleManager is not available on this device.")
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun getCallingNumberN(promise: Promise) {
        try {
            val number =
                    URLDecoder.decode(getPrimaryCall()?.details?.handle.toString(), "UTF-8")
                            .replace(Regex("[^0-9+]"), "")
            promise.resolve(number)
        } catch (e: Throwable) {
            promise.reject("Error", e)
        }
    }


    @ReactMethod
    fun toggleRingingN(action: String) {
        if (action=="play") {
            ringtone.play()
        }
        else {
            ringtone.stop()
        }
    }


    @ReactMethod
    fun toggleSpeakerPhoneN(promise: Promise) {
        try {
            val isSpeakerOn = changeCallAudioRoute2(context);
            promise.resolve(isSpeakerOn)
        } catch (e: Throwable) {
            promise.reject("Error", e)
        }
    }


    @ReactMethod
    fun getAllCallsN(promise: Promise) {
        try {
            val calls = getAllCalls();
            promise.resolve(calls)
        } catch (e: Throwable) {
            promise.reject("Error", e)
        }
    }


    @ReactMethod
    fun acceptN() {
        accept()
    }

    @ReactMethod
    fun rejectN() {
        reject()
    }

    @ReactMethod
    fun toggleHoldN() {
        toggleHold()
    }

    @ReactMethod
    fun toggleMuteN(promise: Promise) {
        try {
            val isMuted = toggleMute()
            promise.resolve(isMuted)
            return
        } catch (e: Throwable) {
            promise.reject("Error", e)
            return
        }
    }

    @ReactMethod
    fun swapN() {
        swap()
    }

    @ReactMethod
    fun mergeN(promise : Promise) {
        try {
            merge()
            promise.resolve(true)
            return
        } catch(e: Throwable) {
            promise.reject(e)
            return
        }
    }

    @ReactMethod
    fun getStateN(promise: Promise) {
        try {
            val state = getState()
            promise.resolve(state)
            return
        } catch (e: Throwable) {
            promise.reject("Error", e)
            return
        }
    }

    @ReactMethod
    fun keypadN(char: String) {
        keypad(char[0])
    }

    @ReactMethod
    fun getCallAudioRouteN(promise: Promise) {
        try {
            val route = getCallAudioRoute()
            promise.resolve(route)
            return
        } catch (e: Throwable) {
            promise.reject("Error", e)
            return
        }
    }

    @ReactMethod
    fun getSupportedAudioRoutesN(promise: Promise) {
        try {
            val state = getSupportedAudioRoutes()
            Log.d("audioRoutes", state.toString())
            promise.resolve(true)
            return
        } catch (e: Throwable) {
            promise.reject("Error", e)
            return
        }
    }

    @ReactMethod
    fun setAudioRouteN(code: String) {
        setAudioRoute(code.toInt())
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun getDurationN(promise: Promise) {
        try {
            Log.d("callDuration", getPrimaryCall()?.getCallDuration().toString())
            val duration = getPrimaryCall()?.getCallDuration().toString()
            promise.resolve(duration)
            return
        } catch (e: Throwable) {
            promise.reject("Error", e)
            return
        }
    }


    @SuppressLint("InvalidWakeLockTag")
    @ReactMethod
    fun acquireWakeLock() {
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager?

        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(PowerManager.FULL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP, "IncomingCallWakeLog")
            wakeLock?.acquire()
        }
    }

    @ReactMethod
    fun releaseWakeLock() {
        if (wakeLock?.isHeld == true) {
            wakeLock?.release()
            wakeLock = null
        }
    }

    //outgoing call

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun getPhoneAccountHandlesN (promise: Promise) {
        try {
            val accounts = Arguments.createArray()
            val phoneAccountsArray = getAccountsHandlesLocal()
            if (phoneAccountsArray != null) {
                for (phoneAccountHandle in phoneAccountsArray) {
                    val phoneAccountMap = Arguments.createMap()
                    phoneAccountMap.putString("id", phoneAccountHandle.id)
                    phoneAccountMap.putString("Name", phoneAccountHandle.userHandle.describeContents().toString())
                    phoneAccountMap.putString("componentName", phoneAccountHandle.componentName.flattenToString())
                    accounts.pushMap(phoneAccountMap)
                }
            }
                promise.resolve(accounts)

        } catch (e: Throwable){
            promise.reject("Error", e)
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun initOutgoingCallN(handleId : String, phoneNumber: String, promise : Promise) {
        try {
            Log.d("phoneAccountHandle.id1" ,handleId)
            if(handleId != null && phoneNumber != null ){
                val phoneAccountsArray = getAccountsHandlesLocal()
                if (phoneAccountsArray != null) {
                    Log.d("phoneAccountHandle.id2" ,handleId)
                    Log.d("phoneAccountHandle.id3" ,phoneNumber)
                    for (phoneAccountHandle in phoneAccountsArray) {
                      if (handleId == phoneAccountHandle.id) {
                          Log.d("phoneAccountHandle.id" ,phoneAccountHandle.id)
                          Bundle().apply {
                         putParcelable(TelecomManager.EXTRA_PHONE_ACCOUNT_HANDLE, phoneAccountHandle)
                         putBoolean(TelecomManager.EXTRA_START_CALL_WITH_VIDEO_STATE, false)
                         putBoolean(TelecomManager.EXTRA_START_CALL_WITH_SPEAKERPHONE, false)
                              if (ActivityCompat.checkSelfPermission(
                                      context,
                                      Manifest.permission.CALL_PHONE
                                  ) != PackageManager.PERMISSION_GRANTED
                              ) {
                                  promise.reject("Error", "missing permission")
                              } else {
                                  telecomManager.placeCall(Uri.parse("tel:$phoneNumber"), this)
                                  promise.resolve(true)
                              }
                          }
                      }
                    }
                }


            } else {
                promise.reject("Error", "Phone Number is invalid")
            }

        } catch (e: Exception) {
            promise.reject("Error", e)

        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    private fun getAccountsHandlesLocal (): MutableList<PhoneAccountHandle>? {
        return if (ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.READ_PHONE_STATE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            null
        } else {
            telecomManager.callCapablePhoneAccounts
        }
    }
}
