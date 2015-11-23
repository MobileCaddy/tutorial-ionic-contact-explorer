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

  AccountDetailCtrl.$inject = ['$scope', '$stateParams','$ionicPopup', '$ionicLoading', '$location', 'AccountService', 'ContactsService'];

  function AccountDetailCtrl($scope, $stateParams, $ionicPopup, $ionicLoading, $location, AccountService, ContactsService) {

		AccountService.get($stateParams.accountId).then(function(account) {
	    $scope.account = account;
	  }, function(e) {
	    console.error('error', e);
	  });

    $scope.addContact = function() {
      var c = $scope.c;
      c.AccountId = $stateParams.accountId;
      c.Name = c.FirstName + ' ' + c.LastName;
      $ionicLoading.show({
        template: '<h1>Saving...</h1><p class="item-icon-left">Saving contact<ion-spinner/></p>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 600,
        duration: 30000
      });
      ContactsService.add(c).then(function(res) {
        $ionicLoading.hide();
        $location.path('/tab/account/' + $stateParams.accountId);
      }).catch(function(e) {
        console.error('addContact failed',e);
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Add Contact Failed!',
          template: '<p>Sorry, something went wrong.</p><p class="error_details">Error: ' +
            e.status + ' - ' + e.mc_add_status + '</p>'
        });
      });
    };

  }

})();