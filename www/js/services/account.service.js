/**
 * Account Factory
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.services')
    .factory('AccountService', AccountService);

  // inject our dependencies
  AccountService.$inject = ['$rootScope', 'devUtils'];

  function AccountService($rootScope, devUtils) {

  	return {
	    all: getAccounts
	  };

	  /**
	   * @description Gets a list of accounts.
	   * @return {promise}
	   */
	  function getAccounts() {
	    return new Promise(function(resolve, reject) {
	      devUtils.syncMobileTable('Account__ap').then(function(resObject){
	        return getAccountsFromSmartStore();
	      }).then(function(accounts){
	        resolve(accounts);
	      }).catch(function(resObject){
	          reject(resObject);
	      });
	    });
	  }


	  function getAccountsFromSmartStore() {
	    return new Promise(function(resolve, reject) {
	      devUtils.readRecords('Account__ap', []).then(function(resObject) {
	        $rootScope.$broadcast('scroll.refreshComplete');
	        resolve(resObject.records);
	      }).catch(function(resObject){
	        reject(resObject);
	      });
	    });
	  }

  }

})();