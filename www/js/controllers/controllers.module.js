/**
 * starter.controllers module
 *
 * @description defines starter.controllers module
 */
(function() {
  'use strict';

  angular.module('starter.controllers', ['ionic'])

  /**
	 * encodeUri filter - needed to encode MC_Proxy_IDs for use in URLs
 	*/
	.filter('encodeUri', function() {
    return function(x) {
      return encodeURIComponent(x);
  	};
	});

})();