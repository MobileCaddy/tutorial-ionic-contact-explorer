/**
 * Accounts Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('AccountsCtrl', AccountsCtrl);

  AccountsCtrl.$inject = ['$scope', '$ionicLoading', 'logger', 'AccountsService'];

  function AccountsCtrl($scope, $ionicLoading, logger, AccountsService) {

 		// unhide our nav bar (element defined in index.html)
 		// No need to pay too much notice, we just need to do this in the first
 		// controller we come to, since we a re manully bootstrapping angular/ionic
  	var e = document.getElementById('my-nav-bar');
  	angular.element(e).removeClass( "mc-hide" );


    var vm     = this,
        logTag = "AccountsCtrl";

    vm.search = {};

    // exposed functions
    vm.clearSearch = clearSearch;


    activate();

    /**
     * @function activate
     * @description Activates our view.
     * @return {[type]} [description]
     */
    function activate() {
  	  // Start a loading spinner
			$ionicLoading.show({
		  	template: '<p>Fetching accounts...</p><ion-spinner/>',
		  	animation: 'fade-in',
		  	showBackdrop: true,
		  	duration: 3000,
		   	delay : 400
			});

			// Attempt to get our accounts
			fetchAccounts();
    }


    /**
     * @functionclearSearch
     * @description clears search box
     */
    function clearSearch () {
      vm.search.query = "";
    }


    /**
     * @function fetchAccounts
     * @description Fetches all the accounts and applies them to our vm
     */
    function fetchAccounts(){
    	// Make a call to our AccountsService to get all the accounts. This service
    	// makes use of JavaScript promises
			AccountsService.all().then(function(accounts){
				// We have our accounts - so assign them so our template can use them
				vm.accounts = accounts;
				$ionicLoading.hide();
			}).catch(function(e){
				// If we haven't yet finished the initial load of data from Salesforce
				// our service rejects with "sync-not-complete".
				if (e != "sync-not-complete") {
					// We have an unknown response - so we log it using the MobileCaddy
					// logger API. This log will be sent to our Salesforce backend
					logger.error(logTag, e);
				}
			});
    }


    // Handle events fired from the SyncService (that is part of the shell code)
    var deregisterHandleSyncTables = $scope.$on('syncTables', function(event, args) {
      if (args.result.toString() == "InitialLoadComplete") {
        // We have been told our initial sync is now complete. We can now safely
        // fetch our data from our service
        fetchAccounts();
      }
    });


    // Handles $destroy event - cleans some listeners etc up
    $scope.$on('$destroy', function() {
    	// We need to deregister our $scope.on to remove memory leak.
      deregisterHandleSyncTables();
    });

  }

})();