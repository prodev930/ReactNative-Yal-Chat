package com.shambyte.helpers


import android.annotation.SuppressLint
import android.content.Context
import android.media.AudioDeviceInfo
import android.os.Handler
import android.media.AudioManager
import android.telecom.Call
import android.telecom.CallEndpoint
import android.telecom.CallAudioState
import android.telecom.InCallService
import android.telecom.VideoProfile
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray


import com.shambyte.extensions.getStateCompat
import com.shambyte.extensions.hasCapability
import com.shambyte.extensions.isConference
import com.shambyte.services.CallService
import java.net.URLDecoder


import java.util.concurrent.CopyOnWriteArraySet


@SuppressLint("NewApi")
class CallManager  {
    companion object {
        @SuppressLint("StaticFieldLeak")
        var inCallService: CallService? = null
        private var call: Call? = null
        private val calls = mutableListOf<Call>()
        private val listeners = CopyOnWriteArraySet<CallManagerListener>()



//        @JvmStatic
        fun onCallAdded(call: Call) {

            Companion.call = call
            calls.add(call)
            for (listener in listeners) {
                listener.onPrimaryCallChanged(call)
            }
            call.registerCallback(object : Call.Callback() {
                override fun onStateChanged(call: Call, state: Int) {
                    updateState()
                }
                override fun onDetailsChanged(call: Call, details: Call.Details) {
                    updateState()
                }
                override fun onConferenceableCallsChanged(call: Call, conferenceableCalls: MutableList<Call>) {
                    updateState()
                }
            })
            Log.d("Call Added", "Added")
        }
        fun onCallRemoved(call: Call) {
            calls.remove(call)
            updateState()
        }


        fun getAllCalls(): ReadableArray {
            val array = Arguments.createArray()
            for (call in calls) {
                val map = Arguments.createMap()
                val state = call.getStateCompat()
                val phoneNumber = URLDecoder.decode(call?.details?.handle.toString(), "UTF-8").replace(Regex("[^0-9+]"), "")
                map.putInt("state", state)
                map.putString("phoneNumber", phoneNumber)
                array.pushMap(map)
            }
            return array
        }



        fun onAudioStateChanged(audioState: CallAudioState) {
            val route = AudioRoute.fromRoute(audioState.route) ?: return
            for (listener in listeners) {
                listener.onAudioStateChanged(route)
            }
        }
        fun getPhoneState(): PhoneState {
            return when (calls.size) {
                0 -> NoCall
                1 -> SingleCall(calls.first())
                2 -> {
                    val active = calls.find { it.getStateCompat() == Call.STATE_ACTIVE }
                    val newCall = calls.find { it.getStateCompat() == Call.STATE_CONNECTING || it.getStateCompat() == Call.STATE_DIALING }
                    val onHold = calls.find { it.getStateCompat() == Call.STATE_HOLDING }
                    if (active != null && newCall != null) {
                        TwoCalls(newCall, active)
                    } else if (newCall != null && onHold != null) {
                        TwoCalls(newCall, onHold)
                    } else if (active != null && onHold != null) {
                        TwoCalls(active, onHold)
                    } else {
                        TwoCalls(calls[0], calls[1])
                    }
                }
                else -> {
                    val conference = calls.find { it.isConference() } ?: return NoCall
                    val secondCall = if (conference.children.size + 1 != calls.size) {
                        calls.filter { !it.isConference() }
                            .subtract(conference.children.toSet())
                            .firstOrNull()
                    } else {
                        null
                    }
                    if (secondCall == null) {
                        SingleCall(conference)
                    } else {
                        val newCallState = secondCall.getStateCompat()
                        if (newCallState == Call.STATE_ACTIVE || newCallState == Call.STATE_CONNECTING || newCallState == Call.STATE_DIALING) {
                            TwoCalls(secondCall, conference)
                        } else {
                            TwoCalls(conference, secondCall)
                        }
                    }
                }
            }
        }
        private fun getCallAudioState() = inCallService?.callAudioState
        fun getSupportedAudioRoutes(): Array<AudioRoute> {
//            val supportedRoutes = AudioRoute.values().filter {
//                val supportedRouteMask = getCallAudioState()?.supportedRouteMask
//                if (supportedRouteMask != null) {
//                    supportedRouteMask and it.route == it.route
//                } else {
//                    false
//                }
//            }.toTypedArray()
            val supportedRoutes = AudioRoute.values()
            Log.d("supportedAudioRoutes", supportedRoutes.toString())
            return supportedRoutes
        }
        fun getCallAudioRoute() = getCallAudioState()?.route
        fun setAudioRoute(newRoute: Int) {
                inCallService?.setAudioRoute(newRoute)
        }
        private fun updateState() {
            val primaryCall = when (val phoneState = getPhoneState()) {
                is NoCall -> null
                is SingleCall -> phoneState.call
                is TwoCalls -> phoneState.active
            }
            var notify = true
            if (primaryCall == null) {
                call = null
            } else if (primaryCall != call) {
                call = primaryCall
                for (listener in listeners) {
                    listener.onPrimaryCallChanged(primaryCall)
                }
                notify = false
            }
            if (notify) {
                for (listener in listeners) {
                    listener.onStateChanged()
                }
            }

            // remove all disconnected calls manually in case they are still here
            calls.removeAll { it.getStateCompat() == Call.STATE_DISCONNECTED }
        }
        fun getPrimaryCall(): Call? {
            return call
        }
        fun getConferenceCalls(): List<Call> {
            return calls.find { it.isConference() }?.children ?: emptyList()
        }
        fun accept() {
            val state = getState()
            Log.d("insideCallManager","Accept Called")
            if (state == Call.STATE_RINGING) {
                call?.answer(VideoProfile.STATE_AUDIO_ONLY)
            }
        }
        fun reject() {
            if (call != null) {
                val state = getState()
                if (state == Call.STATE_RINGING) {
                    call!!.reject(false, null)
                } else if (state != Call.STATE_DISCONNECTED && state != Call.STATE_DISCONNECTING) {
                    call!!.disconnect()
                }
            }
        }

        fun toggleHold(): Boolean {
            val isOnHold = getState() == Call.STATE_HOLDING
            if (isOnHold) {
                call?.unhold()
            } else {
                call?.hold()
            }
            return !isOnHold
        }

        fun toggleMute () : Boolean {
            val isMuted = getCallAudioState()?.isMuted
            if (isMuted == true) {
              inCallService?.setMuted(false);
                return false;
            } else {
                inCallService?.setMuted(true);
                return true
            }
        }



        fun swap() {
            if (calls.size > 1) {
                calls.find { it.getStateCompat() == Call.STATE_HOLDING }?.unhold()
            }
        }


        fun merge() {
            val conferenceableCalls = call!!.conferenceableCalls
            if (conferenceableCalls.isNotEmpty()) {
                call!!.conference(conferenceableCalls.first())
            } else {
                if (call!!.hasCapability(Call.Details.CAPABILITY_MERGE_CONFERENCE)) {
                    call!!.mergeConference()
                }
            }
        }


        fun changeCallAudioRoute() : Boolean {
            val supportAudioRoutes = this.getSupportedAudioRoutes()
            if (supportAudioRoutes.contains(AudioRoute.BLUETOOTH)) {
                //                createOrUpdateAudioRouteChooser(supportAudioRoutes)
                //                return bluetooth devices

                return false
            } else {
                val isSpeakerOn = getCallAudioState()?.route === CallAudioState.ROUTE_SPEAKER
                val newRoute = if (isSpeakerOn) CallAudioState.ROUTE_WIRED_OR_EARPIECE else CallAudioState.ROUTE_SPEAKER
                this.setAudioRoute(newRoute)
                return !isSpeakerOn
            }
        }

        fun changeCallAudioRoute2(context: Context): Boolean {
                val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
                val currentRouter = getCallAudioState()?.route;
                val isSpeakerOn = currentRouter == CallAudioState.ROUTE_SPEAKER;
                Log.d("SHAMBYTE_AUDIO", "CURRENT ROUTER : $currentRouter SPEAKER ROUTE: ${CallAudioState.ROUTE_SPEAKER}")
                val newRoute = if (isSpeakerOn) CallAudioState.ROUTE_WIRED_OR_EARPIECE else CallAudioState.ROUTE_SPEAKER
                if (android.os.Build.VERSION.SDK_INT >= 34) {
                    // get the callEndpoint in android API 34
                    val availableEndpoints = inCallService?.getAvailableEndpoints()
                    Log.d("SHAMBYTE_AUDIO", "AVAILABLE ENDPOINTS - ANDROID 14: ${availableEndpoints.toString()}")
                    // map to audio route type
                    val searchType = if (isSpeakerOn) CallEndpoint.TYPE_EARPIECE else CallEndpoint.TYPE_SPEAKER
                    val callEndpoint = availableEndpoints?.find { it.endpointType == searchType }
                    if (callEndpoint != null) {
                        inCallService?.requestCallEndpointChange(callEndpoint, context.mainExecutor) {
                            Log.d("SHAMBYTE_AUDIO", "SET ENDPOINT - ANDROID 14 : $isSpeakerOn ENDPOINT: ${callEndpoint.endpointName}")
                        }
                    }
                    val availableDevices = audioManager.availableCommunicationDevices;
                    // find device for speaker or earpiece
                    val searchDeviceType = if (isSpeakerOn) AudioDeviceInfo.TYPE_BUILTIN_EARPIECE else AudioDeviceInfo.TYPE_BUILTIN_SPEAKER
                    val device = availableDevices.find { it.type == searchDeviceType }

                    Log.d("SHAMBYTE_AUDIO", "AVAILABLE DEVICES - ANDROID 14: ${availableDevices.toString()} DEVICE: $device")

                    if (device != null) {
                        Log.d("SHAMBYTE_AUDIO", "SET DEVICE - ANDROID 14 : $isSpeakerOn DEVICE: $device")
                        audioManager.setCommunicationDevice(device)
                    }

                    return if (callEndpoint != null || device != null) !isSpeakerOn else isSpeakerOn
                } else {
                    Log.d("SHAMBYTE_AUDIO", "SET ROUTER : $isSpeakerOn $newRoute")
                    audioManager.isSpeakerphoneOn = !isSpeakerOn
                    inCallService?.setAudioRoute(newRoute)
                    return !isSpeakerOn;
                }


        }

        fun addListener(listener: CallManagerListener) {
            listeners.add(listener)
        }
        fun removeListener(listener: CallManagerListener) {
            listeners.remove(listener)
        }


        fun getState() = getPrimaryCall()?.getStateCompat()
        fun keypad(char: Char) {
            call?.playDtmfTone(char)
            Handler().postDelayed({
                call?.stopDtmfTone()
            }, 150L)
        }

    }
}

interface CallManagerListener {
    fun onStateChanged(

    )
    fun onAudioStateChanged(audioState: AudioRoute)
    fun onPrimaryCallChanged(call: Call)
}

sealed class PhoneState
object NoCall : PhoneState()
class SingleCall(val call: Call) : PhoneState()
class TwoCalls(val active: Call, val onHold: Call) : PhoneState()
