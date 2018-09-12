console.log("main.module.js invoked");
(function() {
  'use strict';

  angular
    .module('main', [
      //      'ionic'
      'push'
    ])
    .config(function($stateProvider){
      $stateProvider
        .state('main', {
          url: '/main',
          xyztemplate: '<h1>HELLO</h1>',
          templateUrl: 'main/main.html',
          controller: 'mainCtrl as vm'
        });
    });
  console.log("and configured.");
})();
