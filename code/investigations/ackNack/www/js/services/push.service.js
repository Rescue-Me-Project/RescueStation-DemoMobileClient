/*
(function() {
  'use strict';
  console.log("pushSrvc executed");

    angular
      .module('push', [ 'ngCordova' ] )
      .factory('pushSrvc', pushSrvc)
    ;

    pushSrvc.$inject = [
      '$rootScope',
      '$http',
      '$cordovaPushV5'
    ];
    function pushSrvc(
      $rootScope,
      $http,
      $cordovaPushV5
    ) {
      var service = {};

      service.push = undefined;
      service.registrationId = undefined;
      service.callbackHandler = undefined;
      service.cordovaReady = false;

      service.options = {};

      service.initialisePush = function initialisePush( registeredCallback, messageCallback ) {
        $cordovaPushV5.initialize(service.options).then(function(){

          $cordovaPushV5.onNotification();
          $cordovaPushV5.onError();

          $cordovaPushV5.register().then(
            function registeredOkay( registrationId ) {
              service.registrationId = registrationId;
              if( messageCallback ) {
                service.callbackHandler = messageCallback;
              }
              if(registeredCallback) {
                registeredCallback( registrationId );
              }
            }
          );
        });

        $rootScope.on('$cordovaPushV5:notificationReceived', function pushGotNotificationHandler(event, data) {
          // data.[message|title|count|sound|image|additionalData]
          console.log( "pushv5 got inbound message: ", event, data);
          if(service.callbackHandler) {
            service.callbackHandler( data );
          }
        });
      };

      return service;
    }
//  }, false);

})();
*/

(function() {
  'use strict';
  console.log("pushSrvc executed");

  angular
    .module('main')
    .factory('pushSrvc', pushSrvc)
  ;

  pushSrvc.$inject = [
//    '$q',
//    '$timeout',
//    '$sce',
//    '$http',
//    'theurbanwild'
  ];
  function pushSrvc(
//    $q,
//    $timeout,
//    $sce,
//    $http,
//    theurbanwild
  ) {
    var service = {};

    service.push = undefined;
    service.registrationId = undefined;
    service.callbackHandler = undefined;

    service.initialisePush = function initialisePush( registeredCallback, messageCallback ) {
      service.push = PushNotification.init({
        android:{}
      });
      service.push.on('registration',function(data){
        console.log("push.registration event, ", data);
        console.log("DEVICE ID: "+data.registrationId);
        service.registrationId = data.registrationId;
        if( registeredCallback !== undefined ) {
          service.setCallback( messageCallback );
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

    service.setCallback = function setCallback( handler ) {
      service.callbackHandler = handler;
    };

    return service;
  }

})();
