package edu.txstate.mobile.tracs;


import android.app.Activity;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.VideoView;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

class CustomWebChromeClient extends WebChromeClient {
    private static int FILE_CHOOSER_RESULT_CODE = 1;
    private static int REQUEST_CODE_LOLLIPOP = 2;
    private MainActivity context;

    CustomWebChromeClient(MainActivity context) {
        super();
        this.context = context;
    }

    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        context.setUploadMessage(uploadMsg);
        Intent fileChooser = new Intent(Intent.ACTION_GET_CONTENT);
        fileChooser.addCategory(Intent.CATEGORY_OPENABLE);
        fileChooser.setType("image/*");
        context.startActivityForResult(Intent.createChooser(fileChooser, "File Chooser"), FILE_CHOOSER_RESULT_CODE);
    }

    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
        context.setUploadMessage(uploadMsg);
        Intent fileChooser = new Intent(Intent.ACTION_GET_CONTENT);
        fileChooser.addCategory(Intent.CATEGORY_OPENABLE);
        fileChooser.setType("*/*");
        context.startActivityForResult(Intent.createChooser(fileChooser, "File Chooser"), FILE_CHOOSER_RESULT_CODE);
    }

    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        context.setUploadMessage(uploadMsg);
        Intent fileChooser = new Intent(Intent.ACTION_GET_CONTENT);
        fileChooser.addCategory(Intent.CATEGORY_OPENABLE);
        fileChooser.setType("image/*");
        context.startActivityForResult(Intent.createChooser(fileChooser, "File Chooser"), FILE_CHOOSER_RESULT_CODE);
    }

    @Override
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        ValueCallback<Uri[]> fileMessage = context.getFileMessage();
        if (fileMessage != null) {
            fileMessage.onReceiveValue(null);
        }
        context.setFileMessage(filePathCallback);

        Intent takePicture = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePicture.resolveActivity(Activity.class.cast(context).getPackageManager()) != null) {
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException e) {
                //Ignore
            }

            if (photoFile != null) {
                context.setCameraPhotoPath("file:" + photoFile.getAbsolutePath());
                takePicture.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(photoFile));
            } else {
                takePicture = null;
            }
        }

        Intent fileChooser = new Intent(Intent.ACTION_GET_CONTENT);
        fileChooser.addCategory(Intent.CATEGORY_OPENABLE);
        fileChooser.setType("*/*");

        Intent[] intentArray;
        if (takePicture != null) {
            intentArray = new Intent[]{takePicture};
        } else {
            intentArray = new Intent[0];
        }

        Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
        chooserIntent.putExtra(Intent.EXTRA_INTENT, fileChooser);
        chooserIntent.putExtra(Intent.EXTRA_TITLE, "Upload File");
        chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);

        context.startActivityForResult(chooserIntent, REQUEST_CODE_LOLLIPOP);
        return true;
    }

    private File createImageFile() throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES);
        return File.createTempFile(
                imageFileName,
                ".jpg",
                storageDir
        );
    }
}
