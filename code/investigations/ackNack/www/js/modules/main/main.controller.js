(function () {
  'use strict';

  angular
    .module('main' )
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

    vm.inbound = { data: { },
                   rendered: "No messages yet." };

    vm.initialise = function initialise() {
      pushSrvc.initialisePush( function deviceNowConnected( data ){
        console.log("controller initialised push, got payload ",data );
        // data.deviceId contains the device ID, hopefully, on a registration message
        if (data.hasOwnProperty('registrationId')===true) {
          vm.deviceId = data.registrationId;
          vm.pushConnected = true;
          pushSrvc.setCallback( vm.handleInbound );
          console.log("-- setting pushSrvc.callback to ",vm.handleInbound );
        }
      });
    };

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
          if(result.cancelled===true) {
            console.log("aborted scan!");
            return;
          } else {
            if(result.format==="QR_CODE") {
              pushSrvc.send( result.text, "contact_from_rescuee",
                             {rescuer_device_id:vm.deviceId,
                              event:"rescuee_start" } );
            }
          }
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
      angular.merge( vm.inbound.data, data );
      vm.inbound.rendered = JSON.stringify(vm.inbound.data);

      if(data.hasOwnProperty("additionalData")) {
        if(data.additionalData.event === "rescuee_start") {
          // compose an ack message back
          pushSrvc.send( data.data.rescuer_device_id, "acknowledgement_from_rescuee",
                         { rescuee_device_id:vm.deviceId,
                           event:"ack_from_rescuer" } );
        }
        if(data.additionalData.event === "ack_from_rescuer") {
          alert("ack back");
        }
      }
    };

    vm.initialise();

  }
})();
