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

  ContactsService.$inject = ['devUtils', 'logger'];

  function ContactsService(devUtils, logger) {
  	return {
  		getForAccount: getForAccount
	  };


	  /**
	   * @function getForAccount
	   * @description Gets contacts for an account ID
	   * @param  {string} id Id of our account
	   * @return {promise}    resolves to an array of contacts object
	   */
	  function getForAccount(accountId){
	  	return new Promise(function(resolve, reject) {
        var smartSql = "SELECT * from {Contact__ap} WHERE {Contact__ap:AccountId} = '" + accountId + "'";
        devUtils.smartSql(smartSql).then( function(resObject) {
          resolve(resObject.records);
        }).catch(function(resObject){
          reject(resObject);
        });
      });
	  }

  }

})();