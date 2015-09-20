angular.module("paisOperator").config(['$routeProvider', function(routeProvider) {

	routeProvider.when("/login", {
		templateUrl: "partials/login.html",
		controller: "loginCtrl",
		resolve: {
		}
	})
	routeProvider.when("/main", {
		templateUrl: "partials/main.html",
		controller: "mainCtrl",
		resolve: {
		}
	})
	.otherwise({redirectTo: '/login'});

}]);