angular.module('paisOperator').controller("mainCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout",  
    function (scope, http, filter, ServerService, Upload, timeout) {
	console.log("Results!");
	scope.msg = "User results!";

    scope.clientId = 22;

    scope.selected = {
        "type" : -1,
        "id" : -1
    };

    scope.select = function (type, orderId) {
        scope.selected.type = type;
        scope.selected.id = orderId;
        if (type == 1) {
            for (var i = scope.sensors.length - 1; i >= 0; i--) {
                if (scope.sensors[i].id == orderId) {
                    setMarkers(scope.map, scope.sensors[i]);
                }
            };
        }
    }

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

    scope.sensors = [
            {
                "type" : "Temperatura vazduha",
                "id" : "1",
                "latitude" : 44,
                "longitude" :  20.461414
            },
            {
                "type" : "Temperatura vazduha",
                "id" : "2",
                "latitude" : 43.954545,
                "longitude" :  20.161414
            },
            {
                "type" : "Vlaznost vazduha",
                "id" : "3",
                "latitude" : 44.1678,
                "longitude" :  20.23
            },
            {
                "type" : "Temperatura vazduha",
                "id" : "4",
                "latitude" : 43.9887,
                "longitude" :  20.02975
            },
            {
                "type" : "Vlaznost vazduha",
                "id" : "5",
                "latitude" : 43.78435,
                "longitude" :  19.65342
            }
    ];


    

    scope.isActive = function (type, order) {
        if (scope.selected != null) {
            if (type == scope.selected.type && scope.selected.id == order) {
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

    var myLatlng = new google.maps.LatLng(44, 20.461414);

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
    

    scope.sensorsOnMap;


}]);