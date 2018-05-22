package edu.txstate.mobile.tracs;

import android.content.Intent;
import android.net.Uri;
import android.webkit.ValueCallback;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    private static int FILE_CHOOSER_RESULT_CODE = 1;
    private static int REQUEST_CODE_LOLLIPOP = 2;

    private ValueCallback<Uri> uploadMessage;
    private ValueCallback<Uri[]> fileMessage;

    private String cameraPhotoPath;

    @Override
    protected String getMainComponentName() {
        return "TRACSMobile";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (uploadMessage != null) {
                Uri result = (data == null || resultCode != RESULT_OK) ? null : data.getData();
                uploadMessage.onReceiveValue(result);
                uploadMessage = null;
            }
        } else if (requestCode == REQUEST_CODE_LOLLIPOP) {
            Uri[] results = null;
            if (resultCode == RESULT_OK) {
                if (data == null || data.getData() == null) {
                    if (cameraPhotoPath != null) {
                        results = new Uri[]{Uri.parse(cameraPhotoPath)};
                    }
                } else {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
            }
            if (fileMessage != null) {
                fileMessage.onReceiveValue(results);
            }
            fileMessage = null;
        }
    }

    public void setUploadMessage(ValueCallback<Uri> uploadMessage) {
        this.uploadMessage = uploadMessage;
    }

    public ValueCallback<Uri[]> getFileMessage() {
        return fileMessage;
    }

    public void setFileMessage(ValueCallback<Uri[]> fileMessage) {
        this.fileMessage = fileMessage;
    }

    public void setCameraPhotoPath(String cameraPhotoPath) {

        this.cameraPhotoPath = cameraPhotoPath;
    }
}
