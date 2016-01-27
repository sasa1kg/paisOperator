angular.module('paisOperator').controller("operatorDetailedCtrl", ["$scope", "$http", "$filter", "ServerService", "$routeParams", "$modal",  
	function (scope, http, filter, ServerService, rootParams, modal) {

	console.log("operatorsCtrl!");
	scope.msg = "operatorsCtrl!";

	scope.adminName = "Pais admin";
	scope.save = false;
	scope.save_success = false;
	scope.newCompanyPanel = false;
	scope.param_operator_id = rootParams.id;
	scope.selectedActive = false;

	scope.getOperatorCompanies = function () {
		ServerService.getOperatorCompanies().then(function (data) {
                        if (data) {
                        	scope.companies = data;
                        }
		}, function(reason) {
			    alert("Error occured.");
		});
	}
	scope.getOperatorCompanies();



	scope.addNewCompany = function () {
		ServerService.addOperatorCompany(scope.newCompany).then(function (data) {
                        if (data) {
                        	scope.getOperatorCompanies();
                        		scope.newCompany = {
								"name" : "",
								"city_id" : scope.cities[0].id
							}
                        }
		}, function(reason) {
			    alert("Error occured.");
		});
	}

	scope.getOperator = function () {
		ServerService.getOperator().then(function (data) {
                        if (data) {
                        	scope.selected = data;
                        	if (scope.selected.active == "1") {
                        		scope.selectedActive = true;
                        	} else {
                        		scope.selectedActive = false;
                        	}
                        }
		}, function(reason) {
			    alert("Error occured.");
		});
	}

	scope.getOperator();

	scope.saved = false;
	scope.saveOperator = function () {
        scope.saved = false;
		ServerService.updateOperator(scope.selected).then(function (data) {
                        if (data) {
                        	scope.getOperator();
                        	scope.saved = true;
                        }
		}, function(reason) {
			    alert("Error occured.");
		});

	}


	scope.changePasswordModal = function () {
		console.log("Change password");	
	  var changePasswordInstance = modal.open({
      animation: true,
      templateUrl: 'changePasswordModal.html',
      controller: 'changePasswordInstanceCtrl',
      resolve: {
        client_id: function() {
          return scope.selected.id;
        },
        oldPassword : function () {
          return scope.selected.password;
        }
      }
      
    });

    changePasswordInstance.result.then(function (cancelModal) {
      if(cancelModal == true){
        scope.getOperator();
      } else {
        scope.getOperator();
      }
    });
	}
	

}]);


angular.module('paisOperator').controller('changePasswordInstanceCtrl', function ($scope, $modalInstance, $location, ServerService, client_id, oldPassword) {

    $scope.oldPassword = oldPassword;
    $scope.client_id = client_id;

    $scope.errorCode = "";
    $scope.password= "";
    $scope.passwordRepeat = "";

    $scope.updateAccount = function () {
      $scope.errorCode = "";
      if ($scope.password == undefined || $scope.password.lenght < 4) {
        $scope.errorCode = 1;
        return false;
      }
      if ($scope.passwordRepeat == undefined || ($scope.password != $scope.passwordRepeat)) {
        $scope.errorCode = 2;
        return false;
      }
      $scope.passwordObject = {
        "oldPassword":$scope.oldPassword,
        "newPassword":$scope.password
      };
      ServerService.changePassword($scope.client_id, $scope.passwordObject).then(function (data) {
        if (data) {
         $scope.updateDone = true;
         $scope.updateSuccess = true;
         $modalInstance.close(true);
       } else {
         $scope.updateDone = true;
         $scope.updateSuccess = false;
         $modalInstance.close(false);
       }
     }, function(reason) {
      $scope.updateDone = true;
      $updateSuccess = false;
      $modalInstance.close(false);
    });
    }

    $scope.dismissModal = function () {
      $modalInstance.dismiss('cancel');
    };
  });