angular.module('starter.controllers', ['ionic'])

  /*
  ===========================================================================
    A C C O U N T
  ===========================================================================
  */
.controller('AccountCtrl', function($scope, $rootScope, $ionicLoading, AccountService) {

  // Setup the loader
  $ionicLoading.show({
    template: '<h1>Loading...</h1><p>Fetching Accounts...</p><p><i class="icon ion-loading-b" style="font-size: 32px"></i>',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 600,
    duration: 30000
  });

  /**
   * A callback function that is called when a set of localstorage details are
   * returned.
   * @param  {[Account Objects]} localAccounts
   */
  var localAccCB = function(localAccounts) {
    $rootScope.accounts = localAccounts;
    console.log('Angular: localProjCB, got accounts with arr len', localAccounts.length);
    if (localAccounts.length > 0){
      $ionicLoading.hide();
    }
  };

  AccountService.all($rootScope.refreshFlag, localAccCB).then(function(accounts) {
    $scope.accounts = accounts;
    console.log('AccountIndexCtrl, got accounts');
    $ionicLoading.hide();
  }, function(e) {
    console.error('error', angular.toJson(e));
  });
  $rootScope.refreshFlag = false;


  /**
   * Returns a height for an Account list item
   * @param  {object} item  Account
   * @param  {integer} index
   * @return {integer} pixels
   */
  $scope.getItemHeight = function(item, index) {
    return 50;
  };

    /**
   * Called upon "Pull to Refresh"
   */
  $scope.doRefreshAccounts = function() {
    AccountService.all(true).then(function(accounts) {
      $scope.accounts = accounts;
    }).catch(function(e) {
      console.error('error', angular.toJson(e));
    });
  };
})


/*
===========================================================================
  A C C O U N T    D E T A I L
===========================================================================
*/
.controller('AccountDetailCtrl', function($scope, $stateParams, AccountService) {
  AccountService.get($stateParams.accountId).then(function(account) {
    $scope.account = account;
  }, function(e) {
    console.error('error', angular.toJson(e));
  });
})

/*
===========================================================================
  C O N T A C T S
===========================================================================
*/
.controller('ContactCtrl', function($scope, $stateParams, $ionicLoading, AccountService,ContactService) {
console.debug('ContactCtrl');

  /**
   * Returns a height for a contact list item
   * @param  {object} item  Contact
   * @param  {integer} index
   * @return {integer} pixels
   */
  $scope.getItemHeight = function(item, index) {
    if (typeof(item) == "undefined") {
      return 0;
    } else if (item.Title !== "") {
      return 74;
    } else {
      return 50;
    }
  };

  ContactService.get().then(function(contacts) {
    if (typeof($stateParams.contactId) != "undefined") {
      // viewing single contact so also need to get Account Name
      AccountService.get(contacts[0].AccountId).then(function(account){
        contacts[0].AccountName = account.Name;
        $scope.contact = contacts[0];
        $scope.$apply();
      });
    } else {
      $scope.contacts = contacts;
      $scope.$apply();
    }
  }).catch(function(e) {
    console.error('error', angular.toJson(e));
  });
})

  /*
  ===========================================================================
    M O B I L C A D D Y     S E T T I N G S
  ===========================================================================
  */


  .controller('SettingsHBCtrl', function($scope, $rootScope, DevService) {

    if (localStorage.connection) {
      $scope.heartbeatStatus = localStorage.connection;
    } else {
      $scope.heartbeatStatus = 100100;
    }

    $scope.hbUpdate = function() {
      localStorage.connection = $scope.heartbeatStatus;
    };

  })

  .controller('SettingsCtrl', function($scope, $rootScope, $ionicPopup, $location, DevService) {


  /*
  ---------------------------------------------------------------------------
    Main settings page
  ---------------------------------------------------------------------------
  */
  $scope.logoutAllowedClass = 'disabled';
  $scope.recsToSyncCount = 0;

  $scope.codeflow = LOCAL_DEV;

  DevService.allRecords('recsToSync', false)
    .then(function(recsToSyncRecs) {
    $scope.recsToSyncCount = tableRecs.length;
    if ($scope.recsToSyncCount === 0) {
      $scope.logoutAllowedClass = '';
    } else {
      $scope.recsToSyncCount  = 0;
    }
  }, function(reason) {
    console.error('Angular: promise returned reason -> ' + reason);
  });


  DevService.allRecords('appSoup', false)
    .then(function(appSoupRecs) {
    $scope.settingsRecs = extractSettingsValues(appSoupRecs);
  }, function(reason) {
    console.error('Angular: promise returned reason -> ' + reason);
  });

  function extractSettingsValues(appSoupRecs) {
    var settingRecs = {};
    $j.each(appSoupRecs, function(i,records) {
      var tableRec = {};
      $j.each(records, function(i,record) {
        switch (record.Name) {
          case "Name" :
            tableRec.Name = record.Value;
            break;
          case "CurrentValue" :
            tableRec.Value = record.Value;
            break;
        }
      }); // end loop through the object fields
      settingRecs[tableRec.Name] = tableRec.Value;
    });
    return settingRecs;
  }


  /*
  ---------------------------------------------------------------------------
    Utility Functions
  ---------------------------------------------------------------------------
  */
  function validateAdminPassword(pword) {
    if (pword == "123") {
      return true;
    } else {
      return false;
    }
  }


  /*
  ---------------------------------------------------------------------------
    Log in/out
  ---------------------------------------------------------------------------
  */
  $scope.showAdminPasswordPopup = function() {
    var adminTimeout = (1000 * 60 * 5); // 5 minutes
    if ( $rootScope.adminLoggedIn > Date.now() - adminTimeout) {
      $location.path('tab/settings/devtools');
      $rootScope.adminLoggedIn = Date.now();
      $scope.$apply();
    } else {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.admin">',
        title: 'Enter Admin Password',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          { text: '<b>Continue</b>',
            type: 'button-positive',
            onTap: function(e) {
            if (validateAdminPassword($scope.data.admin)) {
                $location.path('tab/settings/devtools');
                $rootScope.adminLoggedIn = Date.now();
                $scope.$apply();
              } else {
                console.log("Password incorrect");
              }
            }
          },
        ]
      });
    }
  };

  $scope.showConfirmLogout = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Logout',
     template: 'Are you sure you want to logout?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $rootScope.adminLoggedIn = null;
     }
   });
  };


})

/*
---------------------------------------------------------------------------
  MTI (Mobile Table Inspector)
---------------------------------------------------------------------------
*/
.controller('MTICtrl', function($scope, $rootScope, $location, $ionicPopup, DevService) {

  var adminTimeout = (1000 * 60 *5 ); // 5 minutes
  if ( $rootScope.adminLoggedIn > Date.now() - adminTimeout) {
  } else {
    $location.url('tab/settings');
    var alertPopup = $ionicPopup.alert({
      title: 'Access Denied'
    });
    alertPopup.then(function(res) {
      //$location.url('tab/settings');
      $scope.$apply();
    });
  }

  DevService.allTables().then(function(tables) {
    $scope.tables = tables;
  }, function(reason) {
    console.error('Angular: promise returned reason -> ' + reason);
  });

  $scope.showConfirmReset = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Reset App Data',
     template: 'Are you sure you want to reset ALL application data?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       // TODO : What does resetting app really do?
     }
   });
  };

})

.controller('MTIDetailCtrl', function($scope, $rootScope,$stateParams, $ionicLoading, DevService) {
  $ionicLoading.show({
      duration: 30000,
      noBackdrop: true,
      template: '<p id="app-progress-msg" class="item-icon-left"><i class="icon ion-loading-c"></i>Fetching records...</p>'
    });
  $scope.table = {'Name': $stateParams.tableName};
  DevService.allRecords($stateParams.tableName, false)
    .then(function(tableRecs) {
    $scope.tableRecs = tableRecs;
    $ionicLoading.hide();
  }, function(reason) {
    console.error('Angular: promise returned error -> ' + reason);
  });

  $scope.getItemHeight = function(item, index) {
    // seems to be a good height
    return 120 + item.length*55;
  };
})

/*
---------------------------------------------------------------------------
  Deploy Control
---------------------------------------------------------------------------
*/
.controller('DeployCtrl', function($scope, $rootScope, DeployService) {

  function iconForErr(errType) {
    switch(errType) {
        case 'info':
            return 'ion-information-circled';
        default:
            return 'ion-close-round';
    }
  }

  var messages = [{message : 'Uploading bundle...', type : ''}];
  var appConfig = {};

  $scope.messages = messages;

  DeployService.getDetails().then(function(data){
    console.log('data', data);
    appConfig = data;
    return DeployService.deployBunlde(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Uploading cache manifest...', type : ''};
      $scope.messages.push(msg);
    });
    return DeployService.uploadCachePage(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Uploading start page...', type : ''};
      $scope.messages.push(msg);
    });
    return DeployService.uploadStartPage(appConfig);
  }).then(function(res){
    console.dir(res);
    var msg = {message : res, type : 'ok', icon : "ion-checkmark-round"};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      msg = {message : 'Deploy Completed successfully.', type : 'final'};
      $scope.messages.push(msg);
    });
  }).catch(function(err){
    var msg = {message : err.message, type : err.type,  icon : iconForErr(err.type)};
    $scope.$apply(function() {
      $scope.messages.push(msg);
      if (err.type != 'error') {
         msg = {message : 'Deploy Completed successfully.', type : 'final'};
        $scope.messages.push(msg);
      }
    });
    console.debug(err);
  });
});
