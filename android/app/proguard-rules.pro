# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class com.rt2zz.reactnativecontacts.** {*;}
-keepclassmembers class com.rt2zz.reactnativecontacts.** {*;}

# If you want to use Install Referrer tracking, you will need to add this config to your Proguard config
-keep class com.android.installreferrer.api.** {
  *;
}

# If you are experiencing issues with hasGms() on your release apks, please add the following rule to your Proguard config
-keep class com.google.android.gms.common.** {*;}


-keep class io.realm.react.**

# Keep all classes and methods in com.google.mediapipe package
-keep class com.google.mediapipe.** { *; }

# Keep all classes and methods for protobuf
-keep class com.google.protobuf.** { *; }

# Keep all classes and methods for mediapipe_jni
-keep class mediapipe_jni.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep the names of classes/members we need for serialization/deserialization
-keepnames class com.google.mediapipe.** {
  *;
}

# Keep missing classes
-keep class com.google.mediapipe.proto.** { *; }
-keep class javax.lang.model.** { *; }
-keep class autovalue.shaded.com.squareup.javapoet.** { *; }
