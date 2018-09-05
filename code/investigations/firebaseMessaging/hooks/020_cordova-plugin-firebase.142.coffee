#!/usr/bin/env coffee

fs = require 'fs'
{parseString:parseXml, Builder:XmlBuilder} = require 'xml2js'

directoryExists = (path) ->
  try
    return fs.statSync(path).isDirectory()
  catch e
    return false

if directoryExists 'platforms/android'
    console.log 'workarround for https://github.com/arnesson/cordova-plugin-firebase/issues/142'

    #add google-service's client: client_info: mobilesdk_app_id
    googleservicesjson = require '../../google-services.json'
    STRINGS_XML = 'platforms/android/res/values/strings.xml'
    stringsXml = fs.readFileSync STRINGS_XML, {encoding: 'utf8'}

    parseXml stringsXml, (_fail, data) ->
        if _fail then throw new Error _fail

        setall = ( string={} ) ->
            string.$.name = 'google_app_id'
            string.$.templateMergeStrategy = 'preserve'
            string.$.translatable = false
            # is this actually always 0?
            string._ = googleservicesjson.client[0].client_info.mobilesdk_app_id
            return string

        found = false
        for string in data.resources.string
            if string.$.name == 'google_app_id'
                found = true
                setall string # should be noop
                break

        if not found
            data.resources.string.push setall()

        builder = new XmlBuilder()
        fs.writeFileSync STRINGS_XML, builder.buildObject data

    # java text
    # add this if needed
    # add [needed] after this text
    addIfNeeded = (jText, addQ, addQAfter) ->
        jTextLines = jText.split '\n'

        for line in jTextLines
            if line.trim() == addQ
                return jTextLines.join '\n'
        for [lineNo, line] from jTextLines.entries()
            if line.trim() == addQAfter
                jTextLines.splice lineNo+1, 0, addQ
                return jTextLines.join '\n'
        throw new Error "failed to find #{ addQAfter } in file"

    MAINACTIVITY_JAVA = 'platforms/android/YOUR/PACKAGE/NAME/HERE/MainActivity.java'
    mainactivityJava = fs.readFileSync MAINACTIVITY_JAVA, {encoding: 'utf8'}

    jAdd = (add, addAfter) -> mainactivityJava = addIfNeeded mainactivityJava, add, addAfter

    jAdd 'import com.google.firebase.FirebaseApp;', 'import org.apache.cordova.*;'
    jAdd 'FirebaseApp.initializeApp(this);', 'super.onCreate(savedInstanceState);'

    fs.writeFileSync MAINACTIVITY_JAVA, mainactivityJava