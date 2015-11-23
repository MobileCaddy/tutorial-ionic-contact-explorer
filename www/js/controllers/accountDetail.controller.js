/**
 * AccountDetail Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('AccountDetailCtrl', AccountDetailCtrl);

  AccountDetailCtrl.$inject = ['$scope', '$stateParams', 'AccountService'];

  function AccountDetailCtrl($scope, $stateParams, AccountService) {

		AccountService.get($stateParams.accountId).then(function(account) {
	    $scope.account = account;
	  }, function(e) {
	    console.error('error', e);
	  });

  }

})();