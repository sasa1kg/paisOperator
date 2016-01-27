angular.module('paisOperator').controller("resultCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout", "$routeParams",  
    function (scope, http, filter, ServerService, Upload, timeout, routeParams) {
	console.log("Results!");
	scope.msg = "User results!";

	scope.client_id = routeParams.client_id;
	scope.order_id = routeParams.order_id;

	scope.selectedItem = {
		"type" : "",
		"id" : "",
		"data" : ""
	};



	scope.select = function (type, id) {
		if (type == 0) {
			scope.removeSensors();
			for (var i = scope.selectedDetailed.stations.length - 1; i >= 0; i--) {
				if (scope.selectedDetailed.stations[i].station_id == id) {
					scope.selectedItem.type = 0;
					scope.selectedItem.id = scope.selectedDetailed.stations[i].station_id;
					scope.selectedItem.data = scope.selectedDetailed.stations[i];
					scope.placeSensorOnMap();
				}
			};
		} else {
			console.log("select dron");
			for (var i = scope.selectedDetailed.polygons.length - 1; i >= 0; i--) {
				if (scope.selectedDetailed.polygons[i].polygon_id == id) {
					scope.selectedItem.type = 1;
					scope.selectedItem.id = scope.selectedDetailed.polygons[i].polygon_id;
					scope.selectedItem.data = scope.selectedDetailed.polygons[i];
					scope.placePolygonOnMap();
				}
			};
		}
	}


	scope.isActive = function (type, id) {
		if (scope.selectedItem.type == type && scope.selectedItem.id == id) {
			return true;
		} else {
			return false;
		}
	}

	scope.getOrderDetails = function () {
        scope.loaded = false;
        ServerService.clientOrderDetailed(scope.client_id, scope.order_id).then(function (data) {
                        if (data) {
                           scope.selectedDetailed = data;
                           if (data.stations.length > 0) {
                           		scope.select(0, data.stations[0].station_id);
                           } else {
                           		if (data.polygons.length > 0) {
                           			scope.select(1, data.polygons[0].polygon_id);
                           		}
                           }
                           ServerService.getClient(scope.client_id).then(function (data) {
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

    scope.getOrderDetails();

    scope.getSensorTypes = ServerService.getSensorTypes().then(function (data) {
						                if (data) {
						                    scope.sensor_types = data; 
						                } else {
						                    scope.generalError = true;
						                }
						    }, function(reason) {
						         scope.generalError = true;       
						    });

	scope.map = "";
	var myLatlng = new google.maps.LatLng(44, 20.461414);


	scope.placePolygonOnMap = function () {
		setTimeout(function(){ 
            var mapCanvasId = 'map-canvas-results',
             myOptions = {
            center: myLatlng,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            zoom: 6,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            }
            }
            scope.map = new google.maps.Map(document.getElementById(mapCanvasId), myOptions);
            setTerritories(scope.map, scope.selectedItem.data, scope.selectedDetailed.order_id);   
            }
        , 500); 
	}

	function setTerritories(map, polygon, order_id) {
    for (var i = scope.polygonsOnMap.length - 1; i >= 0; i--) {
            scope.polygonsOnMap[i].setMap(null);
            scope.markersOnMap[i].setMap(null);
        };    
    var bounds = new google.maps.LatLngBounds();

            var territoryCoords = [];
            for (var i = polygon.coordinates.length - 1; i >= 0; i--) {
            	territoryCoords.push({
            		lat : polygon.coordinates[i].latitude,
            		lng: polygon.coordinates[i].longitude
            	});
                 bounds.extend(new google.maps.LatLng(polygon.coordinates[i].latitude, polygon.coordinates[i].longitude));
            };

			var territory = new google.maps.Polygon({
			    paths: territoryCoords,
			    strokeColor: '#FF0000',
			    strokeOpacity: 0.8,
			    strokeWeight: 3,
			    fillColor: '#FF0000',
			    fillOpacity: 0.35
			 });

			var contentString = "Surface " + Math.round(polygon.surface * 100) / 100 + " ha <hr>" + polygon.description ;
            var infowindow = new google.maps.InfoWindow({content: contentString});
            

            var marker = new google.maps.Marker({
                position: territoryCoords[0],
                map: map,
                icon: "img/cropcircles.png",
                title: "Territory"
            });
            google.maps.event.addListener(marker, 'click', 
                function (infowindow, marker) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }(infowindow, marker)
            );



			territory.setMap(scope.map);
			marker.setMap(scope.map);
			scope.markersOnMap.push(marker);
            scope.polygonsOnMap.push(territory);

           

        	scope.map.fitBounds(bounds);
    }

    scope.polygonsOnMap = [];
    scope.markersOnMap = [];



    scope.placeSensorOnMap = function () {

        setTimeout(function(){ 
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
            setMarkers(scope.map, scope.selectedItem.data, scope.selectedDetailed.order_id);   
            }
        , 1000); 

	}


	function setMarkers(map, station, order_id) {
	if (scope.sensorOnMap != undefined) {
    	scope.sensorOnMap.setMap(null);
	}
    var bounds = new google.maps.LatLngBounds();

            var title = "Sensor Station (Senz. stanica) " + station.station_id;
            var getType = function (type_id) {
                for (var i = scope.sensor_types.length - 1; i >= 0; i--) {
                    console.log(scope.sensor_types[i].name);
                    if (scope.sensor_types[i].id == type_id) {
                        return scope.sensor_types[i].name;
                    }
                };

            };

            var coords = new google.maps.LatLng(station.latitude, station.longitude);
            var configLink = "http://195.220.224.164/PEP/pais/operators/clients/" + scope.selectedDetailed.client_id + "/orders/" + scope.selectedDetailed.order_id + "/stations/" + station.station_id + "/configFile";
            var contentString = title + "<br/> <hr>" + station.station_description + " <br/>" +
            "<a href=" + configLink + "><b>DOWNLOAD CONFIG FILE</b></a><br/><hr>";

            for (var k = station.sensors.length - 1; k >= 0; k--) {
                var sensType = getType(station.sensors[k].type_id);
                contentString = contentString + sensType + " <br/> ";
                contentString = contentString + station.sensors[k].description + " <br/> ";
                if (station.sensors[k].active == 1) {
                    contentString = contentString +
                    "Active from: " + station.sensors[k].activate_at + "</br>";
                } else {
                    contentString = contentString + "<b>NOT ACTIVE</b><br/><hr>";
                }

            };


            var infowindow = new google.maps.InfoWindow({content: contentString});
            


            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: "img/waterfilter.png",
                title: title
            });
            google.maps.event.addListener(marker, 'click', 
                function (infowindow, marker) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }(infowindow, marker)
                );
            scope.markersOnMap.push(marker);
            bounds.extend(coords);
            scope.map.fitBounds(bounds);
    }

    scope.sensorsOnMap = "";

    scope.removeSensors = function () {
    	if (scope.sensorOnMap != undefined) {
    		scope.sensorOnMap.setMap(null);
		}
    }

    scope.getTypeName = function (id) {
        ServerService.getSensorType(id).then(function (data) {
                if (data) {
                   return data.sensor_type_name;
                } else {
                   return "N/A";
                }
        }, function(reason) {
            return "N/A";
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

    scope.roundDouble = function (num) {
    	return Math.round(num * 100) / 100;
    }

    scope.downloadDronConf = function () {
      var userLS = ServerService.getUserInStorage();
        http.get('http://195.220.224.164/PEP/pais/operators/clients/' + scope.client_id + "/orders/" + scope.order_id + "/polygons/" + scope.selectedItem.id + "/missionPlan", {
        responseType: 'arraybuffer',
        headers: {'X-Auth-Token': userLS.token}
      })
       .success(function (data) {
           var file = new Blob([data], {type: 'text/plain'});
           var fileURL = URL.createObjectURL(file);
           window.open(fileURL);
    });
     //window.open('http://195.220.224.164/PEP/pais/operators/clients/' + scope.client_id + "/orders/" + scope.order_id + "/polygons/" + scope.selectedItem.id + "/missionPlan");
    }


    scope.downloadSensorConf = function (station_id) {
      var userLS = ServerService.getUserInStorage();
        http.get('http://195.220.224.164/PEP/pais/operators/clients/' + scope.client_id + "/orders/" + scope.order_id + "/stations/" + station_id + "/configFile", {
        responseType: 'arraybuffer',
        headers: {'X-Auth-Token': userLS.token}
      })
       .success(function (data) {
           var file = new Blob([data], {type: 'application/json'});
           var fileURL = URL.createObjectURL(file);
           window.open(fileURL);
    });
       //window.open('http://195.220.224.164/PEP/pais/operators/clients/' + scope.client_id + "/orders/" + scope.order_id + "/configFile");
    }


}]);