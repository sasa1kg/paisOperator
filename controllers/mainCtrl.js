angular.module('paisOperator').controller("mainCtrl", ["$scope", "$http", "$filter", "ServerService", "Upload", "$timeout",  
    function (scope, http, filter, ServerService, Upload, timeout) {
       console.log("Results!");
       scope.msg = "User results!";
    scope.frequencies = [];
    
    scope.loaded = true;


    scope.getClientCompaniesOrders = function () {
        console.log("getClientCompaniesOrders");
        ServerService.getMe().then(function (data2) {
            if (data2) {
                scope.operator = data2;
                ServerService.getCompanyOrders(data2.company_id).then(function (data) {
                    if (data) {
                        console.log("Got orders " + angular.toJson(data));
                        scope.getFrequencies();
                        scope.companyOrders = data;
                        if (data.length > 0) {
                            scope.selected = data[0];
                            scope.getOrderDetails(scope.selected.client_id, scope.selected.order_id);
                            scope.getOptions();
                        }
                    } else {
                        location.path("/login");
                    }
                }, function(reason) {
                    location.path("/login");
                });
            } else {
                location.path("/login");
            }
        }, function(reason) {
            location.path("/login");
        });

    }
    scope.getClientCompaniesOrders();


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


scope.getFrequencies = function () {
    ServerService.getFrequencies().then(function (data) {
        if (data) {
         scope.frequencies = data;
     } else {
        scope.frequencies = [];
    }
}, function(reason) {
    scope.frequencies = [];
});
}

scope.getFrequencyName = function (freq_id) {
    for (var i = scope.frequencies.length - 1; i >= 0; i--) {
        if (scope.frequencies[i].id == freq_id) {
            return scope.frequencies[i].description;
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

    scope.downloadSensorConf = function (station_id) {
      var userLS = ServerService.getUserInStorage();
        http.get('http://195.220.224.164/PEP/pais/operators/clients/' + scope.selected.client_id + "/orders/" + scope.selected.order_id + "/stations/" + station_id  + "/configFile", {
        responseType: 'arraybuffer',
        headers: {'X-Auth-Token': userLS.token}
      })
       .success(function (data) {
           var file = new Blob([data], {type: 'application/json'});
           var fileURL = URL.createObjectURL(file);
           window.open(fileURL);
    })
   };


}]);