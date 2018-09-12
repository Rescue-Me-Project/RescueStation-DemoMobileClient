(function() {
  'use strict';

  angular
    .module('main', [ '' ])
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

    service.registrationId = undefined;
    service.callbackHandler = undefined;

    // methods as per https://trello.com/c/3sLYXMgq/64-species-service

    service.initialisePush = function initialisePush( registeredCallback ) {
      service.push = PushNotification.init({
        android:{}
      });
      service.push.on('registration',function(data){
        console.log("push.registration event, ", data);
        console.log("DEVICE ID: "+data.registrationId);
        service.registrationId = data.registrationId;
        if( registeredCallback !== undefined ) {
          registeredCallback( data );
        }
      });
      service.push.on('notification', function(data){
        console.log("push.notification event, ", data);
        registeredCallback( data );
      });

      service..push.on('error', function (error) {
        console.log(error);
      });
    };

    service.setCallback = function setCallback( handler ) {
      service.callbackHandler = handler;
    };

    return service;
  }

})();
