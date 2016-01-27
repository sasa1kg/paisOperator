var ServerService = angular.module('ServerService', [])
	.service('ServerService', ["$q", "$http", "$location", 'localStorageService', 
    function (q, http, location, localStorageService) {

	var serverurl = 'http://195.220.224.164/PEP/';
  var user = "";


      /*-------------------------- LOCAL STORAGE ----------------------------*/

  var putUserInStorage = function (user) {
    console.log("putUserInStorage " + angular.toJson(user));
    localStorageService.set("operatorObject", user);
  }

  this.putUserInStorage = function (user) {
    console.log("putUserInStorage " + angular.toJson(user));
    localStorageService.set("operatorObject", user);
  }

  this.clearUserInStorage = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
              localStorageService.remove(keys[i]);
        };
  }

   var clearUserInStorage = function () {
        var keys = localStorageService.keys();
        for (var i = keys.length - 1; i >= 0; i--) {
              localStorageService.remove(keys[i]);
        };
  }

  var getUserInStorage = function () {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "operatorObject") {
        var userObj = localStorageService.get(keys[i]);
        return userObj;
      }
    };
    return null;
  }

  this.getUserInStorage = function () {
    var keys = localStorageService.keys();
    if (keys.length == 0) {
      return null;
    }
    for (var i = keys.length - 1; i >= 0; i--) {
      if (keys[i] == "operatorObject") {
        var userObj = localStorageService.get(keys[i]);
        return userObj;
      }
    };
    return null;
  }

    /*-------------------------- USER OPERATIONS----------------------------*/

  this.login = function (object) {
      var deffered = q.defer();
      http.post(serverurl + "pais/operators/login", object).
              success(function(data, status) {
                if (status == 200) {
                      putUserInStorage(data);
                      deffered.resolve(true);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });

      return deffered.promise;
  }

   this.changePassword = function (client_id, passwordObj) {
    var userLS = getUserInStorage();
    var token = "";
     if (userLS != null) {
        token = userLS.token;
      }
    var deffered = q.defer();
       http.put(serverurl + "pais/operators/"  +  userLS.id + "/changePassword", passwordObj, {
        headers: {'X-Auth-Token': token}
       }).success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

   this.updateOperator = function (operator) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
        var deffered = q.defer();
        http.put(serverurl + "pais/operators", operator, {
        headers: {'X-Auth-Token': userLS.token}
       }).
                success(function(data, status) {
                  if (status == 200) {
                      deffered.resolve(data);s
                  } else {
                     console.log("Status not OK " + status);
                     deffered.reject("Error");
                  }
                  
                }).
                error(function(data, status) {
                     console.log("Error " + status);
                     deffered.reject("Error");
                });
         return deffered.promise;
    } 


  this.updateClient = function (user) {
    if (user == "" || user == undefined) {
      location.path("/login");
    }
    var deffered = q.defer();
       console.log("updateClient " + JSON.stringify(user));
       http.put(serverurl + "pais/clients", user, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                var result = JSON.stringify(data);
                var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

    this.getOperator = function () {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/operators/" + userLS.id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

    this.getOperatorCompanies = function () {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/operators/companies", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

	this.getClient = function (id) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
		 var deffered = q.defer();
    	 console.log("getClient " + id);
    	 http.get(serverurl + "pais/clients/" + id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
    	 return deffered.promise;
	}

    this.getMe = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
     var deffered = q.defer();
       http.get(serverurl + "pais/operators/" + userLS.id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                    console.log("Status not OK 401 ");
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.getUOMs = function () {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }
      var deffered = q.defer();
      http.get(serverurl + "pais/uoms", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   console.log("Status not OK 401 ");
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.getSensorTypes = function () {
    var userLS = getUserInStorage();
    if (userLS == null) {
      location.path("/login");
    }    
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypesDetailed", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                  console.log("Status not OK 401 ");
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getCompanyOrders = function (company_id) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
     var deffered = q.defer();
       http.get(serverurl + "pais/operators/companies/" + company_id + "/orders", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                console.log();
                if (status == 200) {
                    console.log("Status OK " + status) ;
                    console.log(JSON.stringify(data));
                    deffered.resolve(data);
                } else if (status == 401) {
                  console.log("Status not OK 401 ");
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

    this.getLoggedIn = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
     return userLS;
  }





  this.getCountries = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/countries", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                //var result = JSON.stringify(data);
                //var dataJSON = JSON.parse(result);
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }



  /*-------------------------------------------------------------------------*/
  /*---------------------- SENSOR OPERATIONS --------------------------------*/


  this.getSensorType = function (id) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes/" + id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getSensorUOM = function (id) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/uoms/" + id, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getSensorTypeUOMs = function (sensorTypesId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/sensorTypes/" + sensorTypesId + "/uoms", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  /*-------------------------------------------------------------------------*/
  /*---------------------- ORDER OPERATIONS --------------------------------*/

  this.clientOrder = function (clientId, orderId) {
      if (user == "" || user == undefined) {
        location.path("/login");
      }
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + user + "/orders/" + orderId, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.clientOrders = function (clientId) {
      if (user == "" || user == undefined) {
        location.path("/login");
      }
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + user + "/orders").
              success(function(data, status) {
                console.log("clientOrders " + JSON.stringify(data));
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }
 

  this.clientOrderDetailed = function (clientId, orderId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/" + orderId + "/details").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.clientOrderSensors = function (clientId, orderId, sensorId) {
      if (user == "" || user == undefined) {
        location.path("/login");
      }
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + user + "/orders/" + orderId + "/sensors/" + sensorId).
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }


  this.evaluateOrder = function (clientId, order) {
    if (user == "" || user == undefined) {
        location.path("/login");
    }
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
    var deffered = q.defer();
      console.log("evaluateOrder " + clientId);
       http.post(serverurl + "pais/clients/" + user + "/evaluateOrder", order).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
      return deffered.promise;
  }

  this.placeOrder = function (clientId, order) {
    if (user == "" || user == undefined) {
      location.path("/login");
    }
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
    var deffered = q.defer();
      console.log("evaluateOrder " + user);
       http.post(serverurl + "pais/clients/" + user + "/orders", order).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Status OK");
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
              }).
              error(function(data, status) {
                    console.log("Error");
                   deffered.reject("Error");
              });
      return deffered.promise;
  }


  /*-------------------------------------------------------------------------*/
  /*---------------------- DRON OPERATIONS --------------------------------*/
  this.getFrequencies = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/frequencies").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.getImageTypes = function () {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
      var deffered = q.defer();
      http.get(serverurl + "pais/imageTypes").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  } 

  this.clientOrderImages = function (clientId, orderId) {
      var userLS = getUserInStorage();
      if (userLS == null) {
        location.path("/login");
      }
    var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/" + orderId + "/images").
              success(function(data, status) {
                if (status == 200) {
                    deffered.resolve(data);
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }

  this.getKMLs = function (clientId, orderId) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.get(serverurl + "pais/clients/" + clientId + "/orders/"+ orderId +"/klms", {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }


  this.clearImagesAndKMLs = function (clientId, orderId, polygonId) {
      var userLS = getUserInStorage();
      var deffered = q.defer();
      http.delete(serverurl + "pais/clients/" + clientId + "/orders/"+ orderId +"/polygon/" + polygonId, {
        headers: {'X-Auth-Token': userLS.token}
       }).
              success(function(data, status) {
                if (status == 200) {
                    console.log("Received 200");
                    deffered.resolve(data);
                } else if (status == 404) {
                    console.log("Received 404");
                    deffered.reject("NA");
                } else if (status == 401) {
                   clearUserInStorage();
                   location.path('/login?status=expired');
                } else {
                   console.log("Status not OK " + status);
                   deffered.reject("Error");
                }
                
              }).
              error(function(data, status) {
                   console.log("Error " + status);
                   deffered.reject("Error");
              });
       return deffered.promise;
  }






  /*-------------------------------------------------------------------------*/


    this.hello = function () {
    	return "Hello from service";
    };

    this.testPromise = function (id) {
        var testDef = q.defer();
        var myTimeoutId = setTimeout( function(){
            testDef.resolve("hello");
        }, 2000);
        return testDef.promise;
    }

}]);