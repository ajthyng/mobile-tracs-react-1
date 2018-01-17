package edu.txstate.mobile.tracs;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.ViewGroup.LayoutParams;
import android.webkit.CookieManager;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

public class TRACSWebManager extends SimpleViewManager<CustomWebView> {
    private static final String REACT_CLASS = "TRACSWeb";
    private CustomWebView webView;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected CustomWebView createViewInstance(ThemedReactContext context) {
        final Activity activity = context.getCurrentActivity();
        webView = new CustomWebView(context.getCurrentActivity());
        webView.setWebChromeClient(new CustomWebChromeClient((MainActivity) activity));
        webView.setLayoutParams(
                new LayoutParams(LayoutParams.MATCH_PARENT,
                        LayoutParams.MATCH_PARENT));
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.setAcceptFileSchemeCookies(true);

        return webView;
    }

    @ReactProp(name = "baseUrl")
    public void setBaseUrl(CustomWebView view, @Nullable String baseUrl) {
        view.setBaseUrl(baseUrl);
    }

    @ReactProp(name = "injectedJavaScript")
    public void setInjectedJavaScript(CustomWebView view, @Nullable String jsCode) {
        view.setInjectedJS(jsCode);
    }
}