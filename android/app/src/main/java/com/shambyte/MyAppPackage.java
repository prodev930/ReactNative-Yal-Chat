package com.shambyte; // replace your-app-name with your app’s name
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.shambyte.nativeModules.CallNativeModule;
import com.shambyte.nativeModules.NativeSMSHandler;
import com.shambyte.nativeModules.RecentCallsNativeModule;
// import com.shambyte.nativeModules.AIModelNativeModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new NativeSMSHandler(reactContext));
        modules.add(new CallNativeModule(reactContext));
        modules.add(new RecentCallsNativeModule(reactContext));
        // modules.add(new AIModelNativeModule(reactContext));
        return modules;
    }

}
