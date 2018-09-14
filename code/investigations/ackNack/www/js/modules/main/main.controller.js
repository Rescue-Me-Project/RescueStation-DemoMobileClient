(function () {
  'use strict';

  angular
    .module('main', ['monospaced.qrcode'] )
    .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$state',
    '$sce',
    'pushSrvc'
  ];

  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    pushSrvc
  ) {

    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    vm.pushConnected = false;
    vm.deviceId = "";

    pushSrvc.initialisePush( function deviceNowConnected(data){
      // data.deviceId contains the device ID, hopefully, on a registration message
      if (data.hasOwnProperty('registrationId')===true) {
        vm.deviceId = data.registrationId;
        vm.pushConnected = true;
      }
      pushSrvc.setCallback( vm.handleInbound );
    });


    vm.setRescuer = function setRescuer( newState ) {
      console.log("setting as rescuer", newState );
      vm.isRescuer = newState;
      vm.isRescuee = !newState;
/*
      cordova.plugins.barcodeScanner.encode(
        cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,
        vm.deviceId,
        function success( data ) {
          // barcode is in data.file (type is data.format)
          vm.barcode =  data.file;
        },
        function fail(fail) {
          console.log(fail);
        }
      );
*/
    };

    vm.setRescuee = function setRescuee( newState ) {
      vm.isRescuer = !newState;
      vm.isRescuee = newState;
    };

    vm.rescueeStartCodeScan = function rescueeStartCodeScan() {
      console.log("starting a QR code scan");
      cordova.plugins.barcodeScanner.scan(
        function(result) { // .text .format .cancelled
          console.log("scanned",result);
        },
        function(error) {
          console.log("error scanning",error);
        },
        {
          showTorchButton: false,
          saveHistory: false,
          prompt: "Scan the Rescuer's Code"
        }
      );
    };

    vm.handleInbound = function handleInbound( data ) {
      console.log("got inbound message", data);
    };

  }
})();
