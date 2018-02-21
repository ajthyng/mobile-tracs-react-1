package edu.txstate.applaunch;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class AppLaunch extends ReactContextBaseJavaModule{
    Context context;
    public AppLaunch(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = (Context) reactContext;
    }

    @Override
    public String getName() {
        return "AppLaunch";
    }

    @ReactMethod
    public void load(String appName) {
        if (appName == null || "".equals(appName)) {
            return;
        }

        Intent appIntent = this.context.getPackageManager().getLaunchIntentForPackage(appName);

        if (appIntent != null) {
            this.context.startActivity(appIntent);
        } else {
            try {
                this.context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appName)));
            } catch (ActivityNotFoundException e) {
                this.context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appName)));
            }
        }
    }
}
