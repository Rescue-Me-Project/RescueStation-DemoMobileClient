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
    '$http',
    'pushSrvc',
    'uuid'
  ];
2
  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    $http,
    pushSrvc,
    uuid
  ) {

    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    vm.role = undefined;
    vm.otherRole = undefined;

	vm.ROLES = { RESCUER : 0,
			  	 RESCUEE : 1 };
	vm.ROLE_STRINGS = [ "Rescuer",
						"Rescuee" ];
	vm.MESSAGE_TYPE_ID = { ACK : 0,
						             NACK : 1,
						             CONNECTION_REQUEST: 2,
						             CONNECTION_RESPONSE: 3,
						             MESSAGE: 4 };
	vm.ACTIVITY = { SHOW: 1,
					        SCAN: 2 };
	vm.MESSAGE_TIMEOUT_SECONDS = 10;

    vm.pushConnected = false;
    vm.activity = 0;
    vm.registrationId = "";

    vm.uuid = false;

    vm.inbound = { data: { },
                   rendered: "No messages yet." };

    vm.subscriptionFeedback = "";

/*    vm.restart = function restart() {
      var confirmed = window.confirm("Really clear everything?\nYou will need to do this on both devices.");
      if(confirmed) {
        window.localStorage.removeItem("role");
        window.localStorage.removeItem("uuid");
        vm.isRescuer = false;
        vm.isRescuee = false;
        vm.pushConnected = false;
        vm.uuid = false;
        vm.registrationId = "";
//        pushSrvc.setCallback( vm.dummyCallbackHandler );
        vm.subscriptionFeedback = "Reset completed.";

        vm.initialise();
      }
    };
    vm.dummyCallbackHandler = function dummyCallbackHandler(i) {
      console.log(" *** dummyCallbackHandler - inbound rejected containing ",i);
    };

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
*/

    vm.initialise = function initialise() {

      vm.inbound.rendered = "No registrationId yet...";

      pushSrvc.initialisePush( function deviceNowConnected( data ){
        console.log("controller initialised push, got payload ",data );
        vm.inbound.rendered = "Got connected payload";
        if (data.hasOwnProperty('registrationId')===true) {

          vm.registrationId = data.registrationId;
          vm.pushConnected = true;

          pushSrvc.setCallback( vm.handleInbound );
          pushSrvc.setTimeout( vm.MESSAGE_TIMEOUT_SECONDS * 1000 );
        }
      });
    };

    vm.setRescuer = function setRescuer( ) {
      console.log("setting as rescuer");
      vm.role = vm.ROLES.RESCUER;
      vm.otherRole = vm.ROLES.RESCUEE;
      vm.activity = vm.ACTIVITY.SHOW;
    };

    vm.setRescuee = function setRescuee( ) {
      console.log("setting as rescue*e*");
      vm.role = vm.ROLES.RESCUEE;
      vm.otherRole = vm.ROLES.RESCUER;
      vm.activity = vm.ACTIVITY.SCAN;
    };

    vm.startCodeScan = function startCodeScan() {
      console.log("starting a QR code scan");
      cordova.plugins.barcodeScanner.scan(
        function(qrResult) { // .text .format .cancelled
          console.log("scanned",qrResult);
          if(qrResult.cancelled===true) {
            console.log("aborted scan!");
            return;
          } else {
            if(qrResult.format==="QR_CODE") {
			        // request a connection uuid
			        $http( {
                method: 'POST',
                url: pushSrvc.SERVER_ROOT + "connections",
                headers: {
                  'Content-Type':'application/json'
                },
                data: {
                  'id': uuid.v4()
                }
              } )
			  	      .success(
			  		      function(data, status, headers, config) {
			  		        // we have a connection uuid in data .id
			  		        console.log("id: "+data.id, data);

			  		        vm.uuid = data.id;

			  		        // construct a outbound message
			  		        var payload = {
			  			        connection_id: vm.uuid,
			  			        sender_id: vm.registrationId,
			  			        recipient_id: qrResult.text,
			  			        message_id: uuid.v4(),
			  			        message_type: vm.MESSAGE_TYPE_ID.CONNECTION_REQUEST,
			  			        sender_role: vm.role,
			  			        payload: data.id,
			  			        payload_format_type: 0,
                      notification: {
                        'title': 'Connection Request',
                        'text': 'You have a connection request from another user',
                        'sound': 'default'
                      }
			  		        };
					          pushSrvs.sendPayload( payload ).then(function sentPayloadOkay(data){
						          console.log('initial connection - sent, got', payload, data);
					          }, function errorPayloadSend(err) {
						          console.log('initial connection - failed send, error', payload, error);
					          });
			  	        }).error(
			  		        function(error) {
			  		          // failed to get connection uuid from the server
			  		          alert("Failed requesting a connection UUID.");
		  		          });
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
          window.localStorage.setItem("role","rescuer");
          // log our UUID
          console.log("got sharedUuid of "+data.additionalData.sharedUuid);
          window.localStorage.setItem("uuid", data.additionalData.sharedUuid);
          vm.uuid = data.additionalData.sharedUuid;

          // compose an ack message back
          pushSrvc.send( data.additionalData.rescuer_device_id,
                         "acknowledgement_from_rescuer",
                         { rescuee_device_id:vm.registrationId,
                           "sharedUuid":data.additionalData.sharedUuid,
                           event:"ack_from_rescuer" } );

          vm.startSubscription("rescuer");
        }
        if(data.additionalData.event === "ack_from_rescuer") {
          // do our UUIDs match?
          if( window.localStorage.getItem("uuid")===data.additionalData.sharedUuid ) {
            alert("UUIDs match, good to go");
            vm.uuid = window.localStorage.getItem("uuid");
            window.localStorage.setItem("role","rescuee");

            vm.startSubscription("rescuee");

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
      //alert("NO I AM NOT SUBSCRIBING");
      // subscribe to "vm.uuid/role"
      var topic = vm.uuid + "_" + role;
      console.log( "subscribing to " + topic );
      pushSrvc.subscribe( topic, function() {
      } );
    };
    vm.pingRescuer = function pingRescuer() {
      pushSrvc.sendToTopic( vm.uuid + "_" + "rescuer", "from the rescuee", {"message":"hello from rescuee" } );
    };
    vm.pingRescuee = function pingRescuee() {
      pushSrvc.sendToTopic( vm.uuid + "_" + "rescuee", "from the rescuer", {"message":"hello from rescuer" } );
    };
    vm.initialise();

  }
})();
