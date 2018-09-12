- cordova-plugin-push@2.1.2 does not agree with cordova-plugin-barcodescanner of any version (build errors:
```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':transformClassesWithJarMergingForDebug'.
> com.android.build.api.transform.TransformException: java.util.zip.ZipException: duplicate entry: android/support/v13/view/DragAndDropPermissionsCompat.class
```
)

Solution: upgrade `phonegap-plugin-push` to version 2.2.1 (via https://github.com/phonegap/phonegap-plugin-push/issues/2243 )

Now using plugin set:
* cordova-plugin-whitelist 1.3.3 "Whitelist"
* phonegap-plugin-barcodescanner 8.0.0 "BarcodeScanner"
* phonegap-plugin-push 2.2.1 "PushPlugin"

