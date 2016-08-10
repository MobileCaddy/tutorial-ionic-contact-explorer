/**
 * Accounts Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('AccountCtrl', AccountCtrl);

  AccountCtrl.$inject = ['$stateParams', 'logger', 'AccountsService'];

  function AccountCtrl( $stateParams, logger, AccountsService) {

    var vm     = this,
        logTag = "AccountCtrl";


    activate();


    /**
     * @function activate
     * @description Activates our view - gets an account's details'
     * @return {[type]} [description]
     */
    function activate() {
      AccountsService.get($stateParams.accountId).then(function(account) {
        vm.account = account;
      }, function(e) {
        logger.error(logTag, e);
      });
    }

  }

})();