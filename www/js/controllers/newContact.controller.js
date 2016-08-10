/**
 * Accounts Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('ContactNewCtrl', ContactNewCtrl);

  ContactNewCtrl.$inject = ['$scope', '$stateParams', '$ionicLoading', '$location', 'logger','ContactsService'];

  function ContactNewCtrl( $scope, $stateParams, $ionicLoading, $location, logger, ContactsService) {

    var vmc     = this,
        logTag = "ContactNewCtrl";

    vmc.c = {};

    // exposed functions
    vmc.addContact = addContact;


    function addContact(){
      // Grab the accountId from the parent scope (AccountCtrl)
      vmc.c.AccountId = $scope.vm.account.Id;

      // Make our Name field from our FirstName and LastName fields
      vmc.c.Name = vmc.c.FirstName + ' ' + vmc.c.LastName;

      $ionicLoading.show({
        template: '<p>Saving contact...</p><ion-spinner/>',
        animation: 'fade-in',
        showBackdrop: true,
        duration: 30000,
        delay : 400
      });
      ContactsService.add(vmc.c).then(function(res) {
        $ionicLoading.hide();
        $location.path('/tab/account/' + $stateParams.accountId);
      }).catch(function(e) {
        logger.error('addContact failed',e);
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Add Contact Failed!',
          template: '<p>Sorry, something went wrong.</p><p class="error_details">Error: ' +
            e.status + ' - ' + e.mc_add_status + '</p>'
        });
      });
    }

  }

})();