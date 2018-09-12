(function() {
  'use strict';
  console.log("pushSrvc executed");

  angular
    .module('push')
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
