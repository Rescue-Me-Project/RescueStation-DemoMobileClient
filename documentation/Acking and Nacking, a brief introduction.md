# Acking and Nacking, a brief introduction (the Google FCM Way)

FireBase Cloud Messaging (FCM) is Google's cross-platform platform for sending messages (sometimes shown as *notifications*) to mobile applications.

There are two sides to this:

1. Mobile application interfaces which respond to in-bound messages and expose their contents to running applications, displaying a 'notification', should the application not be in the foreground
2. A HTTP interface on FCM to which messages are sent as JSON (or other) payloads for short-term storage and delivery to devices

1 can be implemented using JavaScript and Cordova using the [phonegap-push-plugin](https://github.com/phonegap/phonegap-plugin-push).

2 Can be implemented in a number of ways, with differing levels of recommendation and sanity. Best practice, and sanity, dictate that the HTTP interface (provided by Google) is interfaced with by a dedicated server which the mobile application communicates with to send outbound messages.

For testing, it is possible to use the unix command-line tool `curl` to send payloads to the server. The following is a simple Bash script which will send messages:

```bash
#!/bin/bash

if (($# >= 4)); then
	curl_url="https://fcm.googleapis.com/fcm/send"
	if (($# == 4)); then
		payload="{\"to\":\"$2\",\"notification\":{\"title\":\"$3\",\"text\":\"$4\",\"sound\":\"default\",\"badge\":\"0\"},\"priority\":\"high\"}"
	else
		if(($# == 5)); then
			payload="{\"to\":\"$2\",\"data\":{\"title\":\"$3\",\"message\":\"$4\",\"foreground\":\"false\",\"coldstart\":\"true\",\"content-available\":\"1\",\"data\":\"$5\"},\"priority\":\"high\"}"
		fi
	fi
	curl -d $payload -H "Content-Type: application/json;" -H "Authorization: key=$1" $curl_url
	echo
else 
	echo "Usage: $0 Server_Key Device_Registration_ID Title Message [Background_content_as_JSON]"
fi
```

To use this script (after you have made sure to save it as something like `server-test.sh` and to make it executable `chmod a+x server-test.sh`), run it in one of two ways:

1. To send a foreground notification message:

`./server-test.sh [YOUR_SERVER_KEY_FROM_FIREBASE] [YOUR_DEVICE_REGISTRATION_ID] [YOUR_NOTIFICATION_TITLE] [YOUR_NOTIFICATION_MESSAGE]`

2. To send a background message, which should wake the application in background mode and send in a JSON payload for processing in the 'additionalData' field)

`./server-test.sh [YOUR_SERVER_KEY_FROM_FIREBASE] [YOUR_DEVICE_REGISTRATION_ID] [YOUR_NOTIFICATION_TITLE] [YOUR_NOTIFICATION_MESSAGE] [YOUR_JSON_PAYLOAD]`

In case 2, the notification title and message are available on the inbound message, but not sent to the notification area.

For both cases, the Server Key is available from the FireBase console when creating the application. The Device Registration ID is returned in the payload when a device registers with FCM and can (briefly) be used as a destination for messages to be sent to. It is a good idea, whilst developing and debugging, to dump this Registration ID to the console so that it is possible to pick it up and use for command-line testing like above.

Also avoid using spaces or punctuation in the messages when testing; properly escape items when specifying a JSON payload. *This is a minimal tool to support the bare basics for testing, not a solid test suite.*

## An overview of moving messages from device-to-device

The days of direct device-to-device communication are gone, certainly as an anonymous device operator, doubly certainly as someone using Google's FireBase as a messaging platform. 

To use FireBase, your application's ID must be registered with Google's FireBase platform, and one or more platforms *added* to it. This will generate a number of keys and identifiers which will be used to identify the destination application and message queues that will be used to distinguish the application. This will also generate a *server secret*, which is used to identify and authenticate the application when sending data. 

Application keys and identifiers can be revoked and regenerated. *Server secrets* **cannot**.

## Messaging directly from FCM's servers to your application



## 

There are two phases to using FireBase (and most similar messaging platforms). 

### Phase 1: Signing on for Messaging

The App must sign in to FireBase. On doing so, a session will be created. During this session, the device will be allocated an arbitrary `deviceId` by the FireBase server, which can be used as a destination for messaging from other devices or from a server.

**This deviceId will expire.** It cannot be used for long-term communications.   If the deviceId can be exchanged quickly with another device signed in to FireBase, they can communicate using the deviceId as a 'to' property.

### Phase 2: Real-world Messaging

Mobile messaging is built around the idea of centralised push; managed server-based infrastructure generates messages for devices, and posts them to the FireBase messaging platform for delivery to individual devices.

A device can *subscribe* to messaging in a number of ways (groups, topics, or direct messaging), but only the *server* can generate a message to push. It does this by sending a `HTTP post` to the FireBase system, which manages the delivery.

It does this due to *authentication* and *secrets*, and to avoid malicious and arbitrary use of the platform by nefarious third parties. 

If the *server secret* is embedded in the mobile application, it is transmitted as part of the `HTTP` payload when posting a message, meaning it is exposed to anyone with a USB cable and the wherewithal to use the Chrome web inspector, or anyone who inspects you application. This is an *extreme vulnerability* and should be avoided. 

Far better practice to have the *server secret* live on a single sever under your control, and your application to send a request to it to then forward on a message to the main FireBase platform.

### Subscription-based messaging

When a device is signed up with FireBase, it can subscribe to *topics*. A *topic* can be thought of as a communal message box; when the server sends a message to a topic, every device that is subscribed to that topic will receive  a copy of the message sent to it (this is often known as *publish/subscribe*, or *pub/sub*.)

This is particularly useful, as there are no limits to the number of topics that can be created, and no overhead in doing so. Message boxes are created on-demand when either 

1. A message is sent to a specific *topic*
2. A device subscribes to a specific *topic*

Again - let your server manage the communications to FireBase (technically, FireBase Cloud Messaging) to avoid embedding the *secret* into your application.

## What's in a message?

Messages are small data payloads that are sent to applications running on mobile devices. They are affected slightly if the application is running in the foreground (ie, it is in full-screen mode and visible on the display currently) or in the background (the application is not running, has been shut down, or is not the main user of the screen of the device).

When an application is in the background, a message will trigger a notification alerting the user to launch the application to process the message. tower

When the application is in the foreground, the message will be silently passed into the application with no need for user interaction, *unless* the message is explicitly sent with a notification element.

There's a good overview at the [phonegap-plugin-push github pages](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/PAYLOAD.md).

When first connecting a running application to FireBase, an `PushNotification.init()` invocation is made. This will trigger an `registration` event. By responding to this event,

`mypush.on('registration', function( data ) { … } );`

an initial confirmation payload will be delivered, which contains the `registrationId` property. This contains the device session ID, which can be used as a `to` destination in further messaging (until the application is force-quit, reinstalled, or something else randomly changes the ID).

After this, messages will be delivered to the `notification` event, which can be hooked into with

`mypush.on('notification', function( data ) { … } );`


A message on Android will generally arrive with the following structure:

```
{
	"message": ""①,
	"title": ""②, 
	additionalData: { ③ 
	    "content_available": ""④,
	    "coldstart": ""⑤,
	    "foreground": "",
	    "key": "value"
	}
```
where

① is the text used in an alert message, if this needs to appear    
② is an alert header    
③ is an object into which arbitrary keys can be placed (or had been placed by the message provider)
④ indicates that there is extended data to this payload (ie, more than a title and message)
⑤ indicates that the application will have been started up in the background to process this message, and this requirement was specified by the payload forwarded from the server (and this being *1* is a requirement for background message handling)
