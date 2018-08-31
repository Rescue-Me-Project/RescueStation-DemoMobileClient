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
	- 