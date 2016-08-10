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

  ContactsCtrl.$inject = ['$stateParams', 'ContactsService'];

  function ContactsCtrl($stateParams, ContactsService) {

    var vmc    = this,
        logTag = "AccountsCtrl";

    vmc.search = {};

    // exposed functions
    vmc.clearSearch = clearSearch;


    activate();


    function activate(){
      // Request contact details from our ContactsService. We are passing in
      // the accountId, taken from the URL (stateparams) as in our app.js
      ContactsService.getForAccount($stateParams.accountId).then(function(contacts) {
        vmc.contacts = contacts;
      }).catch(function(e) {
        console.error('error', e);
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