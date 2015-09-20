angular.module('paisOperator').controller("mainCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout",  
    function (scope, http, filter, ServerService, Upload, timeout) {
	console.log("Results!");
	scope.msg = "User results!";

    scope.clientId = 22;


    scope.accounts = [
            {
                "name" : "Prva",
                "order_id" : "1",
            },
            {
                "name" : "Druga",
                "order_id" : "2",
            },
            {
                "name" : "Treca",
                "order_id" : "3",
            }
    ];

    scope.selectedAccount = scope.accounts[0];
    

    scope.isActive = function (order) {
        if (scope.selectedAccount != null) {
           return scope.selectedAccount.order_id == order;
        } else {
           return false;
        }
    }

    scope.uploadFiles = function(files) {
        scope.files = files;
        angular.forEach(files, function(file) {
            if (file && !file.$error) {
                file.upload = Upload.upload({
                  url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                  file: file
                });

                file.upload.then(function (response) {
                  $timeout(function () {
                    file.result = response.data;
                  });
                }, function (response) {
                  if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                });

                file.upload.progress(function (evt) {
                  file.progress = Math.min(100, parseInt(100.0 * 
                                           evt.loaded / evt.total));
                });
            }   
        });
    }


}]);