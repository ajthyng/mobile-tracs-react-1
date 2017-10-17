package edu.txstate.lockstatus;

import android.app.KeyguardManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LockStatus extends ReactContextBaseJavaModule {

  private static String MODULE_NAME = "LockStatus";
  public LockStatus (ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void isDeviceSecure(Promise promise) {
    try {
        KeyguardManager keyguardManager = (KeyguardManager) getReactApplicationContext().getSystemService(ReactApplicationContext.KEYGUARD_SERVICE);
        boolean isSecure = keyguardManager.isKeyguardSecure();
        promise.resolve(isSecure);
    } catch (Exception e) {
        promise.reject("KEYGUARD ERROR", e);
    }
  }
}
