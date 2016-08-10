/**
 * Accounts Factory
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('AccountsService', AccountsService);

  AccountsService.$inject = ['devUtils', 'logger', 'UserService'];

  function AccountsService(devUtils, logger, UserService) {
  	return {
  		all: all,

  		get: get
	  };

		/**
     * @description Gets a list of accounts.
     * @return {promise} - resolves to an array of records or rejects.
     *                     rejects "sync-not-complete" | errorObj
    */
	  function all() {
	  	return new Promise(function(resolve, reject) {
				devUtils.readRecords('Account__ap', []).then(function(resObject) {
					if (resObject.records.length > 0) {
						resolve(resObject.records);
					} else {
						// If we have 0 length records then check to see if our initial sync
						// has been completed yet
						return UserService.hasDoneProcess("initialDataLoaded");
					}
				}).then(function(hasDoneProcessRes){
					if (hasDoneProcessRes) {
						resolve([]);
					} else {
						// Reject with "sync-not-complete" so our controller knows that the
						// initialSync is still underway, so can't keep the UI locked
						reject("sync-not-complete");
					}
				}).catch(function(resObject){
					reject(resObject);
				});
     });
	  }


	  /**
	   * @function get
	   * @description Gets an account by it's ID
	   * @param  {string} id Id of our account
	   * @return {promise}    resolves to an account object
	   */
	  function get(id){
	  	return new Promise(function(resolve, reject) {
        var smartSql = "SELECT * from {Account__ap} WHERE {Account__ap:Id} = '" + id + "'";
        devUtils.smartSql(smartSql).then( function(resObject) {
          resolve(resObject.records[0]);
        }).catch(function(resObject){
          reject(resObject);
        });
      });
	  }

  }

})();