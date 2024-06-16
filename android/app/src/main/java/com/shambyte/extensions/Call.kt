package com.shambyte.extensions

import android.os.Build
import android.telecom.Call
import android.telecom.Call.STATE_CONNECTING
import android.telecom.Call.STATE_DIALING
import android.telecom.Call.STATE_SELECT_PHONE_ACCOUNT
import androidx.annotation.RequiresApi
import com.shambyte.helpers.Constants

private val OUTGOING_CALL_STATES = arrayOf(STATE_CONNECTING, STATE_DIALING, STATE_SELECT_PHONE_ACCOUNT)

@RequiresApi(Build.VERSION_CODES.M)
@Suppress("DEPRECATION")
fun Call?.getStateCompat(): Int {
    return when {
        this == null -> Call.STATE_DISCONNECTED
        Constants.isSPlus() -> details.state
        else -> state
    }
}

@RequiresApi(Build.VERSION_CODES.M)
fun Call?.getCallDuration(): Int {
    return if (this != null) {
        val connectTimeMillis = details.connectTimeMillis
        if (connectTimeMillis == 0L) {
            return 0
        }
        ((System.currentTimeMillis() - connectTimeMillis) / 1000).toInt()
    } else {
        0
    }
}

@RequiresApi(Build.VERSION_CODES.M)
fun Call.isOutgoing(): Boolean {
    return if (Constants.isQPlus()) {
        details.callDirection == Call.Details.DIRECTION_OUTGOING
    } else {
        OUTGOING_CALL_STATES.contains(getStateCompat())
    }
}

@RequiresApi(Build.VERSION_CODES.M)
fun Call.hasCapability(capability: Int): Boolean = (details.callCapabilities and capability) != 0

@RequiresApi(Build.VERSION_CODES.M)
fun Call?.isConference(): Boolean = this?.details?.hasProperty(Call.Details.PROPERTY_CONFERENCE) == true
