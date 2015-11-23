/**
 * Contacts Factory
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('ContactsService', ContactsService);

  // inject our dependencies. note we are also using '_' (underscore) here. We
  // will use this as it's a handly lib for dealing with collections of objects
  ContactsService.$inject = ['_', 'devUtils'];

  function ContactsService(_, devUtils) {
  	return {
  		get: get,
      add: add
	  };

    /**
     * Adds a contact c
     * @param {object} c Our contact object
     */
    function add(c) {
      return new Promise(function(resolve, reject) {
        devUtils.insertRecord('Contact__ap', c).then(function(resObject){
          // perform background sync - we're not worried about Promise resp.
          devUtils.syncMobileTable('Contact__ap');
          resolve(resObject);
        }).catch(function(e){
          reject(e);
        });
      });
    }

	  /**
	   * @description Gets the list of contacts for a particular account, or gets
     * a single contact's details.
     * Note we are using underscore to filer these but we could just as easily use a
	   * smartSql query (see http://developer.mobilecaddy.net/docs/api/ for details)
	   * @param  {string} accountId The Id of the account we are interested in.
	   * @return {promise}	resolves to a list of contact records (or an error)
	   */
	  function get(accountId, contactId){
      return new Promise(function(resolve, reject) {
        devUtils.readRecords('Contact__ap', []).then(function(resObject) {
        	// we have our contacts, now use underscorejs to get just the ones
        	// we want.
          var contacts = [];
          if (typeof(contactId) != "undefined") {
            var contact = _.where(resObject.records, {'Id': contactId });
            resolve(contact);
          } else if (typeof(accountId) != "undefined") {
            contacts = _.where(resObject.records, {'AccountId': accountId });
          } else {
            contacts = resObject.records;
          }
          resolve(contacts);
        }).catch(function(resObject){
          reject(resObject);
        });
      });
    }

  }

})();