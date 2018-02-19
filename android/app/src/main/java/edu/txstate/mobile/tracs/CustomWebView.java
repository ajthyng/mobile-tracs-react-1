package edu.txstate.mobile.tracs;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.MailTo;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.DownloadListener;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.lang.ref.WeakReference;

public class CustomWebView extends WebView {
    private FileDownloader fileDownloader;
    private String baseUrl = null;
    private String injectedJS = null;

    public CustomWebView(Context context) {
        super(context);
        init(context);
    }

    public CustomWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public CustomWebView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @SuppressLint({"SetJavaScriptEnabled", "ClickableViewAccessibility"})
    private void init(Context context) {
        this.fileDownloader = new FileDownloader(context);
        setWebViewClient(new CustomWebViewClient(context));
        getSettings().setSupportZoom(true);
        getSettings().setBuiltInZoomControls(true);
        getSettings().setDisplayZoomControls(false);
        getSettings().setJavaScriptEnabled(true);
        getSettings().setDomStorageEnabled(true);
        getSettings().setLoadWithOverviewMode(true);
        getSettings().setUseWideViewPort(true);
        setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                CustomWebView.this.downloadFile(url, mimetype);
            }
        });
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_BACK:
                    if (this.canGoBack()) {
                        this.goBack();
                        return true;
                    }
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    private void downloadFile(String url, String mimetype) {
        fileDownloader.downloadFile(url, mimetype);
    }

    public void setInjectedJS(String injectedJS) {
        this.injectedJS = injectedJS;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
        Log.i("Base Url", baseUrl);
        if (this.baseUrl != null) {
            loadUrl(this.baseUrl);
        }
    }

    public void callInjectedJavaScript() {
        if (getSettings().getJavaScriptEnabled() &&
                injectedJS != null && !injectedJS.isEmpty()) {
            loadUrl("javascript:(function(){\n" + injectedJS + ";\n})();");
        }
    }

    static class CustomWebViewClient extends WebViewClient {
        private WeakReference context;
        public CustomWebViewClient(Context context) {
            super();
            this.context = new WeakReference<>(context);
        }
        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            ((CustomWebView) view).callInjectedJavaScript();
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url.startsWith("mailto:")) {
                Intent mailIntent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
                Context context = (Context) this.context.get();
                context.startActivity(mailIntent);
            } else if (url.startsWith("tel:")) {
                Intent phoneIntent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                Context context = (Context) this.context.get();
                context.startActivity(phoneIntent);
            } else {
                view.loadUrl(url);
            }
            return true;
        }
    }
}