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
          templateUrl: 'js/modules/main/main.html',
          controller: 'mainCtrl as vm'
        });
    });
})();
