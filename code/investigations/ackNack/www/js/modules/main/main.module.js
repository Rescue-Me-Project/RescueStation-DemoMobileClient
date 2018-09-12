console.log("main.module.js invoked");
(function() {
  'use strict';

  angular
    .module('main', [
//      'ionic'
    ])
    .config(function($stateProvider){
      $stateProvider
        .state('main', {
          url: '/main',
          resolve: {
          },
          template: '<h1>HELLO</h1>',
          x_templateUrl: 'main/main.html',
          controller: 'mainCtrl as vm'
        });
    });
})();
