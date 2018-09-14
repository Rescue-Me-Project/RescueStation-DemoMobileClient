(function() {
  'use strict';
  console.log("pushSrvc executed");

  $scope.$on('ionic-cordova-push-ready', function(){
    console.log("all ready");
  });

  document.addEventListener("deviceready", function () {

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
      
      //    document.addEventListener("deviceready", function () {
      //      service.cordovaReady = true;
      //  }, false);
      
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
  }, false);

})();
