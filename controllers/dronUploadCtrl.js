angular.module('paisOperator').controller("dronUploadCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout", "$routeParams", "$timeout", "$modal",  
  function (scope, http, filter, ServerService, Upload, timeout, routeParams, $timeout, modal) {
   console.log("Results!");
   scope.msg = "User results!";

   scope.client_id = routeParams.client_id;
   scope.order_id = routeParams.order_id;
   scope.polygon_id = routeParams.polygon_id;

   console.log(scope.client_id + " " + scope.order_id + " " + scope.polygon_id);

   scope.finishedConfig = false;
   scope.finishedImage = false;
   scope.finishedDowngraded = false;
   scope.finishedTiles = false;
   scope.imageCounterFinished = 0;
   scope.tilesCounterFinished = 0;

   scope.type_downgradedImage = 2;
   scope.type_tiles = 3;
   scope.type_dronImage = 0;

  scope.instructionChecked = false;

   scope.imageFiles = [];
   scope.configFile = [];

   scope.largeFiles = [];

   scope.downgraded = [];
   scope.tiles = [];

   scope.uploadedKmls =[];

   scope.prepareFiles = function(files) {
    scope.imageFiles = files;
  }


  scope.prepareConfig = function(file) {
    scope.configFile = file;
  }

  scope.prepareLargeFiles = function (files) {
    scope.largeFiles = files;
  }

  scope.largeInstruction = function () {

  }

  scope.uploadAll = function () {
  scope.finishedImage = false;
   var userLS = ServerService.getUserInStorage();
   angular.forEach(scope.imageFiles, function(file) {
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: 'http://195.220.224.164/PaisImages/clients/'+ scope.client_id +'/orders/'+ scope.order_id +'/polygon/'+ scope.polygon_id +'/imagefile/imageType/' + scope.type_dronImage,
                  //url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                  file: file,
                  headers: {'X-Auth-Token': userLS.token},
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          scope.imageCounterFinished = scope.imageCounterFinished + 1;
          if (scope.imageCounterFinished == scope.imageFiles.length) {
           scope.finishedImage = true;
           scope.imageFiles = [];
           scope.getImages();
         }
       });
      }, function (response) {
        if (response.status > 0)
          scope.errorMsg = response.status + ': ' + response.data;
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * 
         evt.loaded / evt.total));
      });
    }   
  });
angular.forEach(scope.configFile, function(file) {
  if (file && !file.$error) {
    file.upload = Upload.upload({
      url: 'http://195.220.224.164/PEP/pais/clients/'+ scope.client_id +'/orders/'+ scope.order_id +'/polygon/'+ scope.polygon_id +'/klm',
      file: file,
      headers: {'X-Auth-Token': userLS.token},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        scope.finishedConfig = true;
        scope.configFile = [];
        scope.getKMLs();
        console.log("finished");
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
angular.forEach(scope.downgraded, function(file) {
  if (file && !file.$error) {
    file.upload = Upload.upload({
      url: 'http://195.220.224.164/PaisImages/clients/'+ scope.client_id +'/orders/'+ scope.order_id +'/polygon/'+ scope.polygon_id +'/imagefile/imageType/' + scope.type_downgradedImage,
      file: file,
      headers: {'X-Auth-Token': userLS.token},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        scope.finishedDowngraded = true;
        scope.downgraded = [];
        console.log("finished dg");
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
angular.forEach(scope.tiles, function(file) {
  if (file && !file.$error) {
    file.upload = Upload.upload({
      url: 'http://195.220.224.164/PaisImages/clients/'+ scope.client_id +'/orders/'+ scope.order_id +'/polygon/'+ scope.polygon_id +'/imagefile/imageType/' + scope.type_tiles,
      file: file,
      headers: {'X-Auth-Token': userLS.token},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        scope.tilesCounterFinished = scope.tilesCounterFinished + 1;
          if (scope.tilesCounterFinished == scope.tiles.length) {
           scope.finishedTiles = true;
           scope.tiles = [];
           scope.getImages();
           console.log("finished tiles");
         }
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


scope.getImages = function () {
  ServerService.clientOrderImages(scope.client_id, scope.order_id).then(function (data) {
    if (data) {
      scope.selectedDetailedImageResults = data;
     if (data.length > 0) {
       angular.forEach(scope.selectedDetailedImageResults, function (image) {
          image.loading = false;
       });
     }
   } else {
    scope.selectedDetailedImageResults =[];
  }
}, function(reason) {
  scope.selectedDetailedImageResults =[];
});
}

scope.getKMLs = function () {
  scope.uploadedKmls =[];
  ServerService.getKMLs(scope.client_id, scope.order_id).then(function (data) {
    if (data) {
      if (data.length > 0) {
        for (var i = data.length - 1; i >= 0; i--) {
          if (data[i].polygon_id == scope.polygon_id) {
            scope.uploadedKmls.push(data[i]);
          }
        };
      } else {
        scope.uploadedKmls =[];
      }
   } else {
    scope.uploadedKmls =[];
  }
  }, function(reason) {
    scope.uploadedKmls =[];
  });
}

scope.getKMLs();
scope.getImages();

scope.clearImagesAndKMLs = function () {

      var deleteModal = modal.open({
                animation: true,
                templateUrl: 'deleteModal.html',
                controller: 'deleteModalCtrl',
                resolve: {
                   deleteObj: function() {
                          return {
                            "client_id" : scope.client_id,
                            "order_id" : scope.order_id,
                            "polygon_id" : scope.polygon_id
                          };
                      }
                }
      });

      deleteModal.result.then(function (del_p) {
          if (del_p) {
            scope.getImages();
            scope.getKMLs();
          }
      });

  
}



scope.polygonFilter = function (image) {
    if (image.polygon_id == scope.polygon_id) {
      return true;
    } else {
      return false;
    }
}

scope.roundFileSize = function (num) {
  return Math.round((num / 1000000) * 100) / 100;
}

scope.imageLink = function (imageId, docType) {
  var userLS = ServerService.getUserInStorage();
  var img;
  angular.forEach(scope.selectedDetailedImageResults, function(image) {
    if (image.image_id == imageId) {
      image.loading = true;
      img = image;
    }
  });
  http.get('http://195.220.224.164/PaisImages/clients/'+ scope.client_id + '/orders/'+ scope.order_id + '/images/'+ imageId +'/imagefile', {
    headers: {'X-Auth-Token': userLS.token},
    responseType: 'arraybuffer'
  }).success(function (data) {
   var file = new Blob([data], {type: docType});
   var fileURL = URL.createObjectURL(file);
   img.loading = false;
   window.open(fileURL);
 });
}


scope.uploadLarge = function () {
  alert("Upload large test " + scope.largeFiles.length);
    angular.forEach(scope.largeFiles, function(file) {
    if (file && !file.$error) {
      file.upload = Upload.upload({
        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        file: file,
        headers: {'X-Auth-Token': userLS.token},
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          scope.finishedLarge = true;
          console.log("finished");
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


  scope.showInstructionsModal = function () {
    var instructionsModal = modal.open({
                animation: true,
                templateUrl: 'instructionModal.html',
                controller: 'instructionModalCtrl',
                resolve: {
                  checked: function() {
                          return scope.instructionChecked;
                      }
                }
      });

      instructionsModal.result.then(function (saved) {
          scope.instructionChecked = saved;
          if (!saved) {
            scope.largeFiles = [];
          }
      });
  }


  scope.showRoundUpModal = function () {
    var instructionsModal = modal.open({
                animation: true,
                templateUrl: 'uploadRoundUp.html',
                controller: 'uploadRoundUpCtrl',
                resolve: {
                  configFiles: function() {
                        return scope.configFile;
                  },
                  imageFiles : function () {
                        return scope.imageFiles;
                  },
                  bigImageFiles: function () {
                        return scope.largeFiles;
                  }
                }
      });

      instructionsModal.result.then(function (sorted_obj) {
          if (sorted_obj.continue) {
            scope.downgraded = sorted_obj.downgraded;
            scope.tiles = sorted_obj.tiles;
            console.log("DG files " + sorted_obj.downgraded.length + " TILES " + sorted_obj.tiles.length);
            scope.uploadAll();
          }
      });
  }

}]);


angular.module('paisOperator').controller('instructionModalCtrl', function ($scope, $modalInstance, $location, $modal, ServerService, $rootScope, checked) {
      
      $scope.instructionCheck = checked;

      $scope.dismissModal = function () {
          $modalInstance.dismiss('cancel');
      };

      $scope.saveChange = function () {
         $modalInstance.close($scope.instructionCheck);
      }
  
    
});


angular.module('paisOperator').controller('deleteModalCtrl', function ($scope, $modalInstance, $location, $modal, ServerService, $rootScope, deleteObj) {
      
      $scope.deleteObj = deleteObj;
      $scope.loading = false;

      $scope.dismissModal = function () {
          $modalInstance.dismiss('cancel');
      };

      $scope.delete = function () {
        $scope.loading = true;
        ServerService.clearImagesAndKMLs($scope.deleteObj.client_id, $scope.deleteObj.order_id, $scope.deleteObj.polygon_id).then(function (data) {
            if (data) {
               $scope.loading = false;
               $modalInstance.close(true);
             } else {
                $scope.loading = false;
                $modalInstance.close(true);
             }
            }, function(reason) {
                $scope.loading = false;
                $modalInstance.close(true);
        });
      }
  
    
});


angular.module('paisOperator').controller('uploadRoundUpCtrl', function ($scope, $modalInstance, $location, $modal, ServerService, $rootScope, configFiles, imageFiles, bigImageFiles) {
      
      $scope.configFiles = configFiles;
      $scope.imageFiles = imageFiles;
      $scope.bigImageFiles = bigImageFiles;

      $scope.sortedObj = {
        "continue" : true,
        "downgraded" : [],
        "tiles" : []
      };

      $scope.no_of_dg_files = 0;

      $scope.bigImageError = false;
      $scope.configError = false;

      $scope.imageFormat = "";

      $scope.preprocessUpload = function () {
          var kml_check = ".kml";
          var dg_image = "_dg";
          var spot = '.';
          var lower= '_';
          for (var i = $scope.configFiles.length - 1; i >= 0; i--) {
            if ($scope.configFiles[i].name.indexOf(kml_check) == -1) {
              $scope.configError = true;
            }
          };
          if ($scope.bigImageFiles != undefined && $scope.bigImageFiles.length > 0) {
            if ($scope.bigImageFiles.length < 2) {
              $scope.bigImageError = true;
            }
            for (var i = $scope.bigImageFiles.length - 1; i >= 0; i--) {
              if ($scope.bigImageFiles[i].name.indexOf(dg_image) != -1) {
                $scope.no_of_dg_files ++;
                $scope.sortedObj.downgraded.push($scope.bigImageFiles[i]);
              } else {
                var position = $scope.bigImageFiles[i].name.substr($scope.bigImageFiles[i].name.indexOf(lower), $scope.bigImageFiles[i].name.indexOf(spot) - $scope.bigImageFiles[i].name.indexOf(lower));
                var pos_comma = position.replace(/_/g, ',');
                var pos_nums = pos_comma.split(",");
                if (pos_nums.length != 3) {
                  $scope.imageFormat = $scope.bigImageFiles[i].name;
                  $scope.bigImageError = true;
                  return;
                } else {
                  $scope.sortedObj.tiles.push($scope.bigImageFiles[i]);
                }
              }
            };
            if ($scope.no_of_dg_files != 1) {
              $scope.bigImageError = true;
            }
          }

      };

      $scope.preprocessUpload();

      $scope.roundDouble = function (num) {
        return Math.round(num * 100) / 100;
      };

      $scope.dismissModal = function () {
          $modalInstance.dismiss('cancel');
      };

      $scope.saveChange = function () {
         $modalInstance.close($scope.sortedObj);
      }
  
    
});