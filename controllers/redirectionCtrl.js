angular.module('paisOperator').controller("redirectionCtrl", ["$scope", "$http", 
	"$filter", "$routeParams", "ServerService", "$rootScope", "$location", 
	function (scope, http, filter, rootParams, ServerService, rootScope, location) {


	scope.cloudSync = false;
	scope.retrievingUser = false;
	scope.redirectingUser = false;
	scope.error = false;

	scope.redirect = function () {
		 setTimeout(function(){ 
            console.log("Do the redirect");
           	location.search("id", null);
           	location.search("token", null);
           	location.search("role", null);
           	location.path("/main");
           	scope.$apply();
         }, 1500); 
	}

	scope.initFiwareSession = function () {
		scope.cloudSync = true;
		scope.token = (location.search()).token;
		scope.id = (location.search()).id;
		scope.role = (location.search()).role;
		console.log("Token is " + scope.token);
		console.log("ID is " + scope.id);
		console.log("Role is " + scope.role);
		if (scope.token != undefined && scope.role == "operater") {
			scope.retrievingUser = true;
				http.get("http://195.220.224.164/PEP/pais/users/userIDByIDM/" + scope.id, {
					headers: {'X-Auth-Token': scope.token}
				}).
				success(function(data, status) {
					if (status == 200) {
						scope.redirectingUser = true;
						console.log("200");
						console.log(angular.toJson(data));
						ServerService.putUserInStorage({
							'token': scope.token,
							'idm_name' : scope.id,
							"id" : data.user_id
						});
						scope.redirect();
					} else {
						console.log(status);
						alert("Error " + status);
						scope.error = true;
						location.search("id", null);
						location.search("token", null);
						location.search("role", null);
						location.path("/login");
					}
				}).
				error(function(data, status) {
					console.log("Error " + status);
					scope.error = true;
					location.search("id", null);
					location.search("token", null);
					location.search("role", null);
					location.path("/login");
				});
		} else {
			scope.error = true;
			location.search("id", null);
           	location.search("token", null);
           	location.search("role", null);
           	location.path("/login");
		}
	}
	scope.initFiwareSession();
}]);
