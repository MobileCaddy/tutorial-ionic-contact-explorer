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
	    all: getAccounts,

	    get: function(accountId){
      return new Promise(function(resolve, reject) {
        devUtils.readRecords('Account__ap', []).then(function(resObject) {
          var account = _.findWhere(resObject.records, {'Id': accountId });
          resolve(account);
        }).catch(function(resObject){
          reject(resObject);
        });
      });
    }
	  };

	  /**
	   * @description Gets a list of accounts.
	   * @param {boolean} refreshFlag Tells us whether the function has been called
	   *   from a "pull to refresh"
	   * @param {Function} callback A callback function that we can use to pass
	   *   back local data before we receive an update from SFDC
	   * @return {promise}
	   */
	  function getAccounts(refreshFlag, callback) {
	  	// is this the first time we've been called after a start up?
	    var firstStartUp = (typeof $rootScope.firstStartUp == 'undefined' || $rootScope.firstStartUp === true);
	    return new Promise(function(resolve, reject) {
	      if (refreshFlag || firstStartUp) {
	        $rootScope.firstStartUp = false;
	        if (typeof(callback) != "undefined") {
	          // get local accounts return through callback
	          // this will mean our local accounts will be shown intially to improve the UI
	          getAccountsFromSmartStore()
	            .then(function(accounts) {
	              callback(accounts);
	          });
	        }
	        // now make a sync call through the MobileCaddy libraries to sync
	        // our Account__ap table
	        devUtils.syncMobileTable('Account__ap').then(function(resObject){
	        	// once the sync is complete we want to re-read the updates from
	        	// the smartstore
	          return getAccountsFromSmartStore();
	        }).then(function(accounts){
	        	// we now have our updated accounts from SFDC and the smartstore
	        	// so send back in the promise resolution.
	          resolve(accounts);
	          // kick off sync on 'Contact__ap' table
	          devUtils.syncMobileTable('Contact__ap', refreshFlag);
	        }).catch(function(resObject){
	            reject(resObject);
	        });
	      } else {
	      	// not first start or refresh so just get our data from the local
	        getAccountsFromSmartStore().then(function(accounts) {
	          resolve(accounts);
	        }).catch(function(resObject) {
	          reject(resObject);
	        });
	      }
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