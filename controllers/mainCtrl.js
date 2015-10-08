angular.module('paisOperator').controller("mainCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout",  
    function (scope, http, filter, ServerService, Upload, timeout) {
	console.log("Results!");
	scope.msg = "User results!";

    scope.clientId = 22;

    scope.loaded = true;


    scope.getClientCompaniesOrders = function () {

        ServerService.getCompanyOrders().then(function (data) {
                if (data) {
                    scope.companyOrders = data;
                    if (data.length > 0) {
                        scope.selected = data[0];
                        scope.getOrderDetails(scope.selected.client_id, scope.selected.order_id);
                    }
                } else {
                  
                }
        }, function(reason) {
            
        });

    }
    scope.getClientCompaniesOrders();

    scope.getLoggedInUser = function () {

        scope.operator = ServerService.getLoggedIn();

    }
    scope.getLoggedInUser();

    scope.select = function (order_id, client_id) {
        for (var i = scope.companyOrders.length - 1; i >= 0; i--) {
            if (scope.companyOrders[i].order_id == order_id && scope.companyOrders[i].client_id == client_id) {
                scope.selected = scope.companyOrders[i];
                scope.getOrderDetails(scope.selected.client_id, scope.selected.order_id);
            }
        };
           
    }

    
    scope.isActive = function (order_id, client_id) {
        if (scope.selected != null) {
            if (scope.selected.order_id == order_id && scope.selected.client_id == client_id) {
                return true;
            }
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

    scope.getSensorTypeName = function (type_id) {
        for (var i = scope.sensorTypes.length - 1; i >= 0; i--) {
            if (scope.sensorTypes[i].id == type_id) {
                return scope.sensorTypes[i].name;
            }
        };
    }

    scope.getUOMName = function (uom_id) {
        for (var i = scope.uoms.length - 1; i >= 0; i--) {
            if (scope.uoms[i].id == uom_id) {
                return scope.uoms[i].name;
            }
        };
    }

    scope.getOrderDetails = function (client_id, order_id) {
        scope.loaded = false;
        ServerService.clientOrderDetailed(client_id, order_id).then(function (data) {
                        if (data) {
                           scope.selectedDetailed = data;
                           ServerService.getClient(client_id).then(function (data) {
                                    if (data) {
                                        scope.selectedDetailedUser = data;
                                        scope.loaded = true;
                                    } else {
                                            alert("getClient Error occured.");
                                    }
                                }, function(reason) {
                                    alert("getClient Error occured. ");
                                });
                        } else {
                            alert("clientOrderDetailed Error occured.");
                        }
        }, function(reason) {
            alert("clientOrderDetailed Error occured.");
        });
    } 


    scope.getSensorTypesDetailed = ServerService.getSensorTypes().then(function (data) {
                        if (data) {
                           scope.sensorTypes = data;
                        } else {
                            alert("Error occured.");
                        }
    }, function(reason) {
        alert("Error occured.");
    });

    scope.getUOMS = ServerService.getUOMs().then(function (data) {
                        if (data) {
                           scope.uoms = data;
                        } else {
                           alert("Error occured.");
                        }
    }, function(reason) {
        alert("Error occured.");
    });

    /*var myLatlng = new google.maps.LatLng(44, 20.461414);

    $(document).ready(function () {

        var mapCanvasId = 'map-canvas-results',
        myOptions = {
            center: myLatlng,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            zoom: 8,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            }
        }
        scope.map = new google.maps.Map(document.getElementById(mapCanvasId), myOptions);
    });


    function setMarkers(map, sensor) {
        if (scope.sensorOnMap != undefined && scope.sensorOnMap != null) {
            scope.sensorOnMap.setMap(null);
        }
            var bounds = new google.maps.LatLngBounds();


            var coords = new google.maps.LatLng(sensor.latitude, sensor.longitude);
            var contentString = "Sensor ID " + sensor.id;
            var infowindow = new google.maps.InfoWindow({content: contentString});
            


            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: "img/waterfilter.png"
            });
            google.maps.event.addListener(marker, 'click', 
                function (infowindow, marker) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }(infowindow, marker)
            );
            scope.sensorOnMap = marker;
            bounds.extend(coords);
            scope.map.fitBounds(bounds);
        }
    

    scope.sensorsOnMap;*/


}]);