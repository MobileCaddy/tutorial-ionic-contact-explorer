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

  ContactsCtrl.$inject = ['$scope', '$stateParams', 'ContactsService', 'logger'];

  function ContactsCtrl($scope, $stateParams, ContactsService, logger) {

    var vmc    = this,
        logTag = "ContactsCtrl";

    vmc.search = {};

    // exposed functions
    vmc.clearSearch = clearSearch;


    activate();


    function activate(){
      // Request contact details from our ContactsService. We are passing in
      // the accountId, taken from the URL (stateparams) as in our app.js
      ContactsService.getForAccount($stateParams.accountId).then(function(contacts) {
        vmc.contacts = contacts;
        $scope.$apply();
      }).catch(function(e) {
        logger.error(logTag, e);
      });
    }


    /**
     * @functionclearSearch
     * @description clears search box
     */
    function clearSearch () {
      vmc.search.query = "";
    }

  }

})();