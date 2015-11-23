/**
 * Accounts Controller
 *
 * @description A controller for our Accounts listing screen
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('AccountsCtrl', AccountsCtrl);

  // Inject dependencies that we need
  AccountsCtrl.$inject = ['$scope', '$rootScope', '$ionicLoading', 'AccountService'];

  function AccountsCtrl($scope, $rootScope, $ionicLoading, AccountService) {

		// unhide our nav bar (element defined in index.html)
	  var e = document.getElementById('my-nav-bar');
	  angular.element(e).removeClass( "mc-hide" );

	  // Start a loading spinner, this will be closed once the data has been
	  // returned from our service
	  $ionicLoading.show({
	    template: '<h1>Loading...</h1><p class="item-icon-left">Fetching accounts...<ion-spinner/></p>',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 600,
	    duration: 30000,
      delay : 400
	  });

	  // Request data from our AccountService
	  AccountService.all($rootScope.refreshFlag, localAccCB).then(function(accounts) {
	  	// update our scope with the list of accounts that was returned
	    $scope.accounts = accounts;
	    console.log('AccountIndexCtrl, got accounts');
	    $ionicLoading.hide();
	  }, function(e) {
	    console.error('error', e);
	  });
	  $rootScope.refreshFlag = false;


	  /**
	   * @description A callback function that is called when a set of localstorage details are
	   * returned.
	   * This is used so that we can unlock the UI (from the loading spinner)
	   * whilst remote data might be being sync'd.
	   * @param  {[Account Objects]} localAccounts
	   */
	  var localAccCB = function(localAccounts) {
	    $rootScope.accounts = localAccounts;
	    console.log('Angular: localProjCB, got accounts with arr len', localAccounts.length);
	    if (localAccounts.length > 0){
	      $ionicLoading.hide();
	    }
	  };


    /**
	   * Called upon "Pull to Refresh"
	   */
	  $scope.doRefreshFromPulldown = function() {
	    AccountService.all(true).then(function(accounts) {
	      $scope.accounts = accounts;
	    }).catch(function(e) {
	      console.error('error', angular.toJson(e));
	    });
	  };

    $scope.search = {};
	  /**
	   * Called when clearing the Search input
	   */
	  $scope.clearSearch = function() {
	    $scope.search.query = "";
	  };

  }

})();