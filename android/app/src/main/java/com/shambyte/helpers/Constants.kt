package com.shambyte.helpers

import android.os.Build
import android.telecom.Call
import androidx.annotation.ChecksSdkIntAtLeast
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray

class Constants {
    companion object {
        @ChecksSdkIntAtLeast(api = Build.VERSION_CODES.S)
        fun isSPlus() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
        @ChecksSdkIntAtLeast(api = Build.VERSION_CODES.Q)
        fun isQPlus() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q

        @ChecksSdkIntAtLeast(api = Build.VERSION_CODES.O)
        fun isOreoPlus() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O

//        @RequiresApi(Build.VERSION_CODES.M)
//        fun convertListToReadableArray(list: MutableList<Call>): ReadableArray {
//
//
//            for (item in list) {
//                when (item) {
////                    is String -> array.pushString(item)
////                    is Int -> array.pushInt(item)
////                    is Double -> array.pushDouble(item)
////                    is Boolean -> array.pushBoolean(item)
////                    is Map<*, *> -> array.pushMap(Arguments.makeNativeMap(item as Map<String, Any>))
////                    is List<*> -> array.pushArray(Arguments.makeNativeArray(item as List<Any>))
////                    // Add more cases for other types if needed
////                    else -> array.pushNull()
//                }
//            }
//            return array
//        }
    }
}