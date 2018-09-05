## project setup

`cordova create nativePushTest uk.ac.mmu.digitallabs.rs.nativepushtest nativePushTest`
`cordova plugin add phonegap-plugin-push@2.1.2`
`cordova platform add android@6.3.0`
`cordova platform add browser`


### create a firebase project 

new firebase project, then create an android application, then make sure the name matches the package name in cordova - the 'uk.ac.mmu.digitallabs.rs.nativepushtest' bit. download (for android) the google-services.json file

#### copy firebase config files into the project

They need to be linked into the `config.xml` file.

- in config.xml, under <platform name="android"> tag, added
	`<resource-file src="google-services.json" target="app/google-services.json" />` and copy over google provisioning from firebase to
	- ./platforms/android/google-services.json
	- ./google-services.json


