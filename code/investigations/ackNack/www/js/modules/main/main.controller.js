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
    'pushSrvc',
    'uuid'
  ];

  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    pushSrvc,
    uuid
  ) {

    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    vm.pushConnected = false;
    vm.deviceId = "";

    vm.uuid = false;

    vm.inbound = { data: { },
                   rendered: "No messages yet." };

    vm.subscriptionFeedback = "";

    // restore any state in the interface
    if(window.localStorage.getItem("uuid")) {
      vm.uuid = window.localStorage.getItem("uuid");
      if(window.localStorage.getItem("role")) {
        vm.isRescuer = false;
        vm.isRescuee = false;
        if(window.localStorage.getItem("role")==="rescuer") {
          vm.isRescuer = true;
          vm.isRescuee = false;
        }
        if(window.localStorage.getItem("role")==="rescuee") {
          vm.isRescuer = false;
          vm.isRescuee = true; 
        }
      }
    }

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
              var sharedUuid = uuid.v4();
              window.localStorage.setItem("uuid", sharedUuid);
              console.log("sending UUID of "+sharedUuid);
              pushSrvc.send( result.text, "contact_from_rescuee",
                             {rescuer_device_id:vm.deviceId,
                              "sharedUuid":sharedUuid,
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
          window.localstorage.setItem("role","rescuer");
          // log our UUID
          console.log("got sharedUuid of "+data.additionalData.sharedUuid);
          window.localStorage.setItem("uuid", data.additionalData.sharedUuid);
          vm.uuid = data.additionalData.sharedUuid;

          vm.startSubscription("rescuee");

          // compose an ack message back
          pushSrvc.send( data.additionalData.rescuer_device_id,
                         "acknowledgement_from_rescuer",
                         { rescuee_device_id:vm.deviceId,
                           "sharedUuid":data.additionalData.sharedUuid,
                           event:"ack_from_rescuer" } );
        }
        if(data.additionalData.event === "ack_from_rescuer") {
          // do our UUIDs match?
          if( window.localStorage.getItem("uuid")===data.additionalData.sharedUuid ) {
            alert("UUIDs match, good to go");
            window.localstorage.setItem("role","rescuer");

            vm.startSubscription("rescuer");

          } else {
            alert("Error: Mismatched UUIDs!");
            console.log("stored UUID",window.localStorage.getItem("uuid"));
            console.log("roundtripped UUID",data.additionalData.sharedUuid);
          }
          // pof
          //alert("ack back");
        }
      }
    };

    vm.startSubscription = function startSubscription( role ) {
      // subscribe to "vm.uuid/role"
      var topic = vm.uuid + "/" + role;
      console.log( "subscribing to " + topic );
      pushSrvc.subscribe( topic, function() {

      } );
    };
    vm.pingRescuer = function pingRescuer() {
      pushSrvc.sendToTopic( vm.uuid + "/" + "rescuer", "from the rescuee", {} );
    };
    vm.pingRescuee = function pingRescuer() {
      pushSrvc.sendToTopic( vm.uuid + "/" + "rescuee", "from the rescuer", {} );
    };
    vm.initialise();

  }
})();
