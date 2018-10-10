SERVER_ROOT = "http://digitallabshub:8080";

(function() {
  'use strict';
  console.log("pushSrvc executed");

  angular
    .module('push', [])
    .factory('pushSrvc', pushSrvc)
  ;

  pushSrvc.$inject = [
//    '$q',
//    '$timeout',
//    '$sce',
    '$http'
  ];
  function pushSrvc(
//    $q,
//    $timeout,
//    $sce,
    $http
  ) {
    var service = {};

    service.SERVER_ROOT = SERVER_ROOT;

    service.push = undefined;
    service.registrationId = undefined;
    service.callbackHandler = undefined;

    service.subscribeCallbackHandler = undefined;
    service.timeoutMs = undefined;

	  service.setTimeout = function setTimeout(millis) {
		  service.timeoutMs = millis;
	  };

    service.initialisePush = function initialisePush( registeredCallback ) {
      service.push = PushNotification.init({
        android:{}
      });
      service.push.on('registration',function( data ){
        console.log("push.registration event, ", data);
        console.log("DEVICE ID: "+data.registrationId);
        service.registrationId = data.registrationId;
        if( registeredCallback !== undefined ) {
          //service.setCallback( registeredCallback );
          console.log( "- invoking callback for registration with ", data );
          registeredCallback( data );
        }
      });
      service.push.on('notification', function(data){
        console.log("push.notification event, ", data);
        service.callbackHandler( data );
      });

      service.push.on('error', function (error) {
        console.log(error);
      });
    };

    // pass in a notification object in payload.notification
    // pass in recipient device in payload.recipient_id
	  service.sendPayload = function sendPayload( payload ) {

      var sendRequest = { method: 'POST',
                          url: SERVER_ROOT + '/messages',
                          data: JSON.stringify(payload)
                         };

      if(service.timeoutMs!==undefined) {
      	sendRequest.timeout = service.timeoutMs;
      }
      console.log('push.service.sendPayload - using ',sendRequest );

      return $http( sendRequest ); // shld send back a promise
	  };

    service.send = function send( recipient, title,  payload ) {
      console.error("service.send no longer available! ");
      return;

      var fullPayload = {
        'to': recipient,
        'notification': {
          'title': title,
          'text': 'this is the text property',
          'sound': 'default',
          'badge': '0'
        },
        'foreground': 'false',
        'coldstart': 'true',
        'content-available': '1',
        'data': payload,
        'priority': 'high' 
      };
      var headers = {
        'Content-Type':'application/json',
        'Authorization':'key='+window.FCMKEY+'' //,
      };
      var sendRequest = { method: 'POST',
                          url: 'https://fcm.googleapis.com/fcm/send',
                          data: fullPayload,
                          headers: headers };
      if(service.timeoutMs!==undefined) {
      	sendRequest.timeout = service.timeoutMs;
      }
      console.log("sendRequest: ", sendRequest);
      $http( sendRequest ).then(
        function success(result) {
          console.log('POSTED SUCCESS', result);
        },
        function fail( error ) {
          console.log("POSTED WITH PROVISIOS", error);
        }
      );
    };

    service.setCallback = function setCallback( handler ) {
      service.callbackHandler = handler;
    };

    // subscription handling

    service.subscribe = function subscribe( topic ) {
      console.log("SKIPPING SUBSCRIPTION FOR NOW", topic);
      //return;
      service.push.subscribe( topic, function subscribeSuccess(){
        console.log("push.service - subscription to '"+topic+"' successful!");

        service.push.on('registration', function (data) {
          alert('registrationId:' + data.registrationId);
        });

        service.push.on('notification', function (data) {
          alert('push:' + JSON.stringify(data));
        });

        service.push.on('error', function (e) {
          alert('error: ' + e.message);
        });

      }, function subscribeFailure( err ){
        console.log("push.service - subscription to '"+topic+"' failed, error:", err);
        throw( err );
      });
    };

    service.sendToTopic = function sendToTopic( topic, title,  payload ) {
      var fullPayload = {
        //'to': recipient,
        topic: topic,
        'notification': {
          'title': title,
          'text': 'this is the text property',
          'sound': 'default',
          'badge': '0'
        },
        //'foreground': 'false',
        //'coldstart': 'true',
        //'content-available': '1',
        'data': payload,
        'priority': 'high' 
      };
      var headers = {
        'Content-Type':'application/json',
        'Authorization':'key='+window.FCMKEY+'' //,
      };
      var sendRequest = { method: 'POST',
                          url: 'https://fcm.googleapis.com/v1/projects/project-930939697602/messages:send',
                          //url: 'https://fcm.googleapis.com/fcm/send',
                          data: fullPayload,
                          headers: headers };
      if(service.timeoutMs!==undefined) {
      	sendRequest.timeout = service.timeoutMs;
      }
      console.log("Topic sendRequest: ", sendRequest);
      $http( sendRequest ).then(
        function success(result) {
          console.log('TOPIC POSTED SUCCESS', result);
        },
        function fail( error ) {
          console.log("TOPIC POSTED WITH PROVISIOS", error);
        }
      );
    };

    return service;
  }

})();
