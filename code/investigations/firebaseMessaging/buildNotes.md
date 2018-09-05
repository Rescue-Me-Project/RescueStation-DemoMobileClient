# Firebase plugin ( [via](https://github.com/arnesson/cordova-plugin-firebase) )
`cordova plugin add cordova-plugin-firebase --save` 

# Enabling Firebase push

( [via](https://medium.com/@felipepucinelli/how-to-add-push-notifications-in-your-cordova-application-using-firebase-69fac067e821) )

- go to firebase console
- added application 'rescueStationPushTest`
	- project ID: 'rescuestationpushtest' (auto-generated)
	- Analytics Location: United Kingdom
	- Cloud Firestore location: us-central
	- No, sharing of analytics
	- Yes, I am using Firebase services and agree to terms

- on project overview page, click 'add firebase to android app'
	- in cordova app `config.xml` set app id (at very top of file) to `uk.ac.mmu.digitallabs.rs.fbtest`
	- on Firebase, used add ID (as above) as Android Package Name
	- set nickname to `rescueStationFirebaseMessaging`
	- clicked 'register app'
	- downloaded config file (.json for android, .plist for ios)
		- move this into project root - 'firebaseMessaging' cordova project

- in config.xml 
	- added `<resource-file src="google-services.json" target="google-services.json" />` under '<platform name="android">` element ( [via](https://stackoverflow.com/a/51581751) )
	- ( [via](http://www.damirscorner.com/blog/posts/20171110-SpecifyingAndroidSdkVersionInCordova.html) ) might need to update android SDK to 6.3.0 to support messaging
	-  `cordova platform rm android; cordova platform add android@6.3.0`
	-  had to `npm install android-versions --save` before I could `cordova android run android` ( though `cordova android build android` was fine)
	-   