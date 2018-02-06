package edu.txstate.applaunch;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.ref.WeakReference;

public class AppLaunch extends ReactContextBaseJavaModule{
    WeakReference<ReactApplicationContext> context;
    public AppLaunch(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = new WeakReference<>(reactContext);
    }

    @Override
    public String getName() {
        return "AppLaunch";
    }

    @ReactMethod
    public void load(String appName) {
        ReactApplicationContext context = this.context.get();
        Intent appIntent = new Intent(context.getPackageManager().getLaunchIntentForPackage(appName));

        if (appIntent != null) {
            context.startActivity(appIntent);
        } else {
            try {
                context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appName)));
            } catch (ActivityNotFoundException e) {
                context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appName)));
            }
        }
    }
}
