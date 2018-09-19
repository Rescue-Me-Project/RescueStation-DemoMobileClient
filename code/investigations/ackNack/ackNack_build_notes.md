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

------------

~~## Message sending and authorisation~~

~~Unless I'm doing something wrong which I can't identify, Google Firebase rejects messages sent from devices using the key (and also states it's worst practice).~~

~~Instead, you need to generate a [private key for the service account](https://firebase.google.com/docs/cloud-messaging/auth-server).~~

~~1. Go to 'Service Accounts' under the application settings in the Firebase console~~
~~2. Click 'generate new private key' button towards the bottom of the page~~
~~3.~~

- when using the hacky send:
	- Do not use `from` as a property in the `data` object, as it's a reserved word
	- Do not wrap the `key=GOOGLE_PROVIDED_KEY` in the `Authorization` header with quotes! the GOOGLE_PROVIDED_KEY must be as-is - eg, `key=ASD123:123123etc`
	- Make sure the `data` object is sent as an object to `$http` as it will manage serialisation itself (and confuse the Google servers if passed in as a string)

-----

## UUID exchange

When two devices are paired, they must exchange a key by which they can uniquely communicate with and identify each other. The Rescuer device will generate a UUID and send it to the Rescuee, and both devices will make a record of this. On recording it, both devices will then subscribe to this inbox for notifications, differentiating on their roles by watching a UUID/er or UUID/ee inbox.

### UUID generation

[angular-uuid](https://github.com/munkychop/angular-uuid) is a wrapper for the DigitalLabs' preferred UUID generator.

`npm install --save angular-uuid`

### Channels, topics and subscription

We need to create a channel and subscribe to it. The [push API is documented here](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md). A seemingly naïf implementation ( [via](https://firebase.google.com/docs/cloud-messaging/android/topic-messaging) ) is to specify a 'topic' as key when posting a message, which is distributed to all subscribed clients.


