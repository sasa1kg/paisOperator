angular.module('paisOperator').controller("loginCtrl", ["$scope", "$location", "$filter", "ServerService",  function (scope, location, filter, ServerService) {

	console.log("Login!");
	scope.msg = "Login!";

	scope.expired = false;
	
	scope.init = function () {
		scope.status = (location.search()).status;
		if (scope.status != undefined && scope.status == expired) {
			scope.expired = true;
		} 
	}	
	scope.init();

}]);