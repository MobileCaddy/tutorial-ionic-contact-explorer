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

  ContactsService.$inject = ['devUtils', 'logger', 'AccountsService'];

  function ContactsService(devUtils, logger, AccountsService) {

  	var contact;

  	return {
  		get: get,

  		getForAccount: getForAccount
	  };



	  /**
	   * @function get
	   * @description Gets single contact with ID id and enriches with Name from
	   *              related account
	   * @param  {string} id Id of our contact
	   * @return {promise}    resolves to an array of contacts object
	   */
	  function get(id){
	  	return new Promise(function(resolve, reject) {
        var smartSql = "SELECT * from {Contact__ap} WHERE {Contact__ap:Id} = '" + id + "'";
        devUtils.smartSql(smartSql).then( function(resObject) {
          contact = resObject.records[0];
	        return AccountsService.get(contact.AccountId);
	      }).then(function(account){
	        contact.AccountName = account.Name;
	        resolve(contact);
        }).catch(function(resObject){
       		reject(resObject);
        });
      });
	  }


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