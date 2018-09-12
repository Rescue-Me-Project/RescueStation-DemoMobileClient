(function () {
  'use strict';

  angular
    .module('main')
    .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$state',
    '$sce',
    'push'
  ];

  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    pushSrvc
  ) {

/*   angular.element(document).bind('keyup', function(e) {
      $scope.$apply(function(){
        if (e.key==="Enter") {
          $state.go('quiz');
        }
      });
    });
*/
    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    //vm.isRescuee

    vm.pushConnected = false;
    vm.deviceId = "";

    pushSrvc.initialisePush( function deviceNowConnected(data){
      // data.deviceId contains the device ID, hopefully, on a registration message
      if (data.hasOwnProperty('deviceId')===true) {
        vm.deviceId = data.deviceId;
        vm.pushConnected = true;
      }
    }, vm.handleInbound );

    pushSrvc.setCallback( vm.handleInbound );

    vm.setRescuer = function setRescuer( newState ) {
      vm.isRescuer = newState;
      vm.isRescuee = !newState;
    };
    vm.setRescuee = function setRescuee( newState ) {
      vm.isRescuer = !newState;
      vm.isRescuee = newState;
    };

    vm.handleInbound = function handleInbound( data ) {
      console.log("got inbound message", data)
    };

  }
})();
