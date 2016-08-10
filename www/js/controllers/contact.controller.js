/**
 * Contact Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('ContactCtrl', ContactCtrl);

  ContactCtrl.$inject = ['$stateParams', 'ContactsService', 'logger'];

  function ContactCtrl($stateParams, ContactsService, logger) {

    var vm    = this,
        logTag = "ContactCtrl";

    vm.search = {};

    // exposed functions
    vm.clearSearch = clearSearch;


    activate();


    function activate(){
      // Request contact details from our ContactsService. We are passing in
      // the contactId, taken from the URL (stateparams) as in our app.js
      ContactsService.get($stateParams.contactId).then(function(contact) {
        vm.contact = contact;
      }).catch(function(e) {
        logger.error(logTag, e);
      });
    }


    /**
     * @functionclearSearch
     * @description clears search box
     */
    function clearSearch () {
      vm.search.query = "";
    }

  }

})();