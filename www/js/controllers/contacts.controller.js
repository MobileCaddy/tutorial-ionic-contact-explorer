/**
 * Contacts Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('ContactsCtrl', ContactsCtrl);

  ContactsCtrl.$inject = ['$scope', '$stateParams', 'ContactsService', 'AccountService'];

  function ContactsCtrl($scope, $stateParams, ContactsService, AccountService) {

  	// Request contact details from our ContactService. We are passing in
  	// the accountId, taken from the URL (stateparams) as in our app.js
	  ContactsService.get($stateParams.accountId, $stateParams.contactId).then(function(contacts) {
	    if (typeof($stateParams.contactId) != "undefined") {
        // viewing single contact so also need to get Account Name
        AccountService.get(contacts[0].AccountId).then(function(account){
          contacts[0].AccountName = account.Name;
          $scope.contact = contacts[0];
          $scope.$apply();
        });
      } else {
        $scope.contacts = contacts;
        $scope.$apply();
      }
	  }).catch(function(e) {
	    console.error('error', e);
	  });

  }

})();