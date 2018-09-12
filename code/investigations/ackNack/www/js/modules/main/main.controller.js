(function () {
  'use strict';

  angular
    .module('main')
    .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$state',
    '$sce'
  ];

  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce
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
  }
})();
