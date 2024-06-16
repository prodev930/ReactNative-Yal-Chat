package com.shambyte.helpers

import android.telecom.CallAudioState
import androidx.annotation.DrawableRes
import androidx.annotation.StringRes
import com.shambyte.R

enum class AudioRoute(val route: Int) {
    SPEAKER(CallAudioState.ROUTE_SPEAKER),
    EARPIECE(CallAudioState.ROUTE_EARPIECE),
    BLUETOOTH(CallAudioState.ROUTE_BLUETOOTH),
    WIRED_HEADSET(CallAudioState.ROUTE_WIRED_HEADSET),
    WIRED_OR_EARPIECE(CallAudioState.ROUTE_WIRED_OR_EARPIECE);

    companion object {
        fun fromRoute(route: Int?) = values().firstOrNull { it.route == route }
    }
}
