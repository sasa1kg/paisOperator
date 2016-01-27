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
	routeProvider.when("/uploadResults/:order_id/:client_id/", {
		templateUrl: "partials/results.html",
		controller: "resultCtrl",
		resolve: {
		}
	})
	routeProvider.when("/myProfile", {
		templateUrl: "partials/operatorDetailed.html",
		controller: "operatorDetailedCtrl",
		resolve: {
		}
	})
	routeProvider.when("/dronUpload/:order_id/:client_id/:polygon_id/", {
		templateUrl: "partials/dronUpload.html",
		controller: "dronUploadCtrl",
		resolve: {
		}
	})
	routeProvider.when("/orderOverview/:order_id/:client_id/", {
		templateUrl: "partials/orderOverview.html",
		controller: "orderOverviewCtrl",
		resolve: {
		}
	})
	.when("/redirection", {
		templateUrl: "partials/redirection.html",
		controller: "redirectionCtrl",
		resolve: {
		}
	})
	.otherwise({redirectTo: '/login'});

}]);