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


---------

more build problems - push plugin being skipped


https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/INSTALLATION.md
fix: https://github.com/phonegap/phonegap-plugin-push/issues/2229#issuecomment-369921541

```
I lost some time trying to find the right project.properties. 😄

So it's in platforms/android/project.properties that you should remove

cordova.system.library.3=com.android.support:support-v13:26.+
or replace it by

cordova.system.library.3=com.android.support:support-v13:27.+
(but I don't know the difference between the two of them)
```

QR code generation

- original plugin generates an android 'intent' and pops out to a different application - adding instead

https://github.com/monospaced/angular-qrcode

`npm install angular-qrcode`

