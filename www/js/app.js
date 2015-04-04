//var app = angular.module('myApp',['onsen','ngMaterial']);

var app = ons.bootstrap('myApp', ['onsen', 'LocalStorageModule']);

// app.config(function (localStorageServiceProvider) {
//   localStorageServiceProvider
//     .setStorageType('sessionStorage');
// });

app.service('GlobalParameters', function(){
    
	this.search_home = 1;
	this.shop_list_home = 0;
	this.shop_home = 0;
	this.is_owner = 0;
	this.is_business = 0;
	this.selected_biz="";
	this.login_status = 0;
	this.current_user = {};

	this.SetHomePage = function(a, b, c){
		this.search_home = a;
		this.shop_list_home = b;
		this.shop_home = c;

	}

	this.SetIsOwner = function(value){
		this.is_owner = value;
	}

	this.SetIsBusiness = function(value){
		this.is_business = value;
	}

	this.setSelectedBiz = function(value){
		this.selected_biz = value;
	}

	this.setLoginStatus = function(value){
		this.login_status = value;
	}

	this.setCurrentUser = function(value){
		this.current_user = value;
	}
});

app.service('MsgService', ['$window', function(win) {
   	var msgs = [];
   	return function(msg) {
    	ons.notification.alert({message: msg});
   	};
}]);

app.service('LocationService', function($http, $timeout){
	this.getCurrentLocation = function(){
		// console.log('Service');
		// var position = [{
		// 	latlng: "",
		// 	formatted_address: "",
		// 	search_city :""
		// }];
		var latlng;
    	$timeout(function(){	
    		
	    	navigator.geolocation.getCurrentPosition(function(position) {
	    		//$scope.location_text =position.coords.latitude;
	    		latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
	    		console.log(latlng['lat']);
	    		//position['latlng'] = latlng;
	    		var geocoder = new google.maps.Geocoder();
	    		geocoder.geocode({'location': latlng}, function(results, status) {
			          if (status === google.maps.GeocoderStatus.OK) {
			            if (results[1]) {

			            	//$scope.$apply(position['formatted_address'] =results[1].formatted_address);
			            	//position['search_city_en'] = results[1].formatted_address.split(',')[1].replace('-ku','').replace(' ','');
			            	//console.log(search_city);
			            } else {
			              window.alert('No results found');
			            }
			          } else {
			            window.alert('Geocoder failed due to: ' + status);
			          }
			        });
		      		        
				}, function(error){
					console.log('code: '    + error.code + ' ' + 'message: ' + error.message + '\n');
					alert(error.message + " Please enable the location service.");
				});
    		},10);

		//console.log(test)
		return latlng;
    }
});

app.controller('SignupCtrl', function($scope, GlobalParameters, $http, $window, localStorageService){
	console.log('Signup Ctrl');
	console.log(FB);

	$scope.SignUpWithFacebook = function(){
		FB.login(function(response) {
	    if (response.authResponse) {
	     console.log('Welcome!  Fetching your information.... ');
	     FB.api('/me', function(response) {
	       console.log('Good to see you, ' + response.name + '.');
	     });
	    } else {
	     //console.log('User cancelled login or did not fully authorize.');
	     url = 'https://www.facebook.com/dialog/oauth?client_id=1687245944857278&redirect_uri=https://www.facebook.com/connect/login_success.html&display=touch';
        $window.open(url);
	    }
	}, {scope: 'email,user_likes'});
    }

	$scope.signup = function(fullname, email, password){
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/authenticate.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { signup: 1, fullname: fullname, email: email, password: password }
		}

		console.log(req);
			$http(req).then(function(data){
				console.log(data);
				if (data['data'] == 0){
					alert('The current email is already existed. Please use different email.');
				} else {
					var login_user = data['data'];
					GlobalParameters.login_status = 1;
					GlobalParameters.setCurrentUser(login_user);
					localStorageService.set('login_user', login_user);
					//GlobalParameters.current_user = login_user;
					$scope.myNavigator.pushPage('profile_index.html', {login_user: login_user});
				}
			}, function(error){
				alert('Failed: ' + error);
			});
	}

	alert = function(msg) {
	    ons.notification.alert({
	      message: msg
	    });
	}
	//console.log(FB);
	
	$scope.alert = function(msg) {
    	ons.notification.alert({message: msg, title: 'Vcess'});
	}
	
	// login = function () {
 //    /**
 //     * Calling FB.login with required permissions specified
 //     * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
 //     */
 //    ezfb.login(function (res) {
 //      /**
 //       * no manual $scope.$apply, I got that handled
 //       */
 //      if (res.authResponse) {
 //        updateLoginStatus(updateApiMe);
 //      }
 //    }, {scope: 'email'});
 //  };

//scope.login = login();
});


app.controller("LoginCtrl", function($scope, $http, GlobalParameters, localStorageService){
	console.log('LoginCtrl');

	console.log(FB);

	$scope.SendEmail = function(email){
		alert("A password recovery email has been sent.");
		$scope.myNavigator.pushPage('profile_index.html');
	}

	$scope.login = function(email, password){
		console.log('Login');
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/authenticate.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { login: 1, email: email, password: password }
		}

		console.log(req);
			$http(req).then(function(data){
				console.log(data);
				if (data['data'].length == 0){
					//$scope.data_not_found = 1;
					alert('Incorrect email or password. Please try again.');
				} else {
					var login_user = data['data'];
					GlobalParameters.login_status = 1;
					GlobalParameters.setCurrentUser(login_user);
					localStorageService.set('login_user', login_user);
					console.log('local');
					console.log(localStorageService.get('login_user'));
					$scope.myNavigator.pushPage('profile_index.html', {login_user: login_user});
				}
			}, function(error){
				alert('Failed: ' + error);
			});
	}

	alert = function(msg) {
	    ons.notification.alert({
	      message: msg
	    });
	}

	$scope.login_facebook = function(){
		console.log('login facebook');
	}
});


app.controller("SearchCtrl", function($scope, $timeout, $http, $q, $filter){
	console.log('SearchCtrl');

	$scope.Clear = function(){
		$scope.search_result = 0;
		$scope.businesses = {};
		$scope.disabled = 1;
	}

	var current_location = [{
		addr: '', 
		coordinate: {}
	}];

	$scope.data_not_found = 0;
	var orderBy = $filter('orderBy');

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}
	
	alert = function(msg) {
	    ons.notification.alert({
	      message: msg,
	      title: 'Vcess'
	    });
	}
	

	getCurrentLocation = function(){
		var deferred = $q.defer();
		
		$timeout(function(){
	    	navigator.geolocation.getCurrentPosition(function(position) {
	    		var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
	    		var geocoder = new google.maps.Geocoder();
	    		geocoder.geocode({'location': latlng}, function(results, status) {
			          if (status === google.maps.GeocoderStatus.OK) {
			            if (results[1]) {
			            	current_location['coordinate'] = latlng;
			            	current_location['addr'] = results[1].formatted_address;
			            	deferred.resolve(current_location);
			            } else {
			              	console.log('No results found');
			              	deferred.reject('No results found');
			            }
			          } else {
			            deferred.reject('Geocoder failed due to: ' + status);
			          }
			        });
		      		        
				}, function(error){
					alert(error.message + " Please enable the location service.");
					deferred.reject('code: '    + error.code + ' ' + 'message: ' + error.message + '\n');
				});
    		},100);
		return deferred.promise;
	}

	$scope.search = function(search_text, location, search_item_flag){
    	console.log(search_text);
    	if (search_text == undefined) {
    		alert('Please input your search keyword.');
    	} else {
    		if (location === "All locations") {
	    		location = "";
	    	}
		    	GetData(search_text, location, search_item_flag).then(function(result) {
		    		console.log(result.length);
		    		// $scope.businesses = result;
		    		// $scope.predicate = 'distance';
		    		// $scope.search_result = 1;
		    		if (result.length == 0){
		    			$scope.search_result = 1;
		    			$scope.data_not_found = 1;
		    			$scope.load_complete = 1;
		    		} else {
		    			$scope.businesses = result;
			    		$scope.data_not_found = 0;
			    		//$scope.predicate = 'distance';
			    		$scope.search_result = 1;
			    		if (result[0]['distance'] == ""){
			    			$scope.predicate = '-rate';
			    			no_distance = 1;
			    			$scope.disabled = 1;
			    		} else {
			    			$scope.predicate = 'distance';
			    			$scope.disabled = 0;
			    			no_distance = 0;
			    		}
			    		if (selected_keyword != undefined){
							$scope.load_complete = 1;
						}
		    		}

		    		//console.log(result);
		    		
		    	});
    	}
    	
    	
    }

	OnLoad = function(){
		
		$scope.businesses = {};
		getCurrentLocation().then(function(result) {
    		$scope.location_text = result['addr'];
    		if (selected_keyword != undefined){
				//console.log(selected_keyword);
				$scope.search_text = selected_keyword;
				$scope.search($scope.search_text, $scope.location_text, 1);
			} else {
				$scope.load_complete = 1;	
			}
    	}, function(error){
    		console.log(error);
    		$scope.load_complete = 1;
    	});
	}
	var selected_keyword = myNavigator.getCurrentPage().options.keyword;	
	OnLoad();

    $scope.CurrentLocation = function(){
    	$scope.Clear();

    	getCurrentLocation().then(function(result) {
    		$scope.location_text = result['addr'];
    	}, function(error){
    		console.log(error);
    	});
    }

    var no_distance = 0;

    

    $scope.SortBy =function(sort_item){
    	if (no_distance){
			alert('Specific source location required.');
		} else {
			$scope.predicate = sort_item;	
		}
    }

    function GetSearchCity(addr){
    	var search_city;
    	if (addr.indexOf(',') > -1){
    		addr = addr.replace(/,/gi,'').split(" ");
			for (i = 0; i < addr.length; i++) { 
		    	if (addr[i].indexOf('-ku') > -1 || addr[i].indexOf('-shi') > -1){
		    		search_city = addr[i].replace(/-ku|-shi/gi,'');	
		    	}
			}
    	} else {
    		if (addr.indexOf('-ku') > -1 || addr.indexOf('-shi') > -1){
		    	search_city = addr.replace(/-ku|-shi/gi,'');	
		    } else {
		    	search_city = addr;
		    }
    	}
    	return search_city;
    }
   
	function GetData(search_text, location, search_item_flag){
		console.log(location);  
		var deferred = $q.defer();
		var search_city = GetSearchCity(location);
		console.log(search_city);  

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { keyword: search_text, city_en: search_city, search_item_flag: search_item_flag }
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);
				var all_data = data['data'];
				if (all_data.length == 0){
					//$scope.data_not_found = 1;
					//alert('data_not_found');
				} else {
					
					for (i = 0; i < all_data.length; i++) { 
							all_data[i]['tel-phone'] = "tel:" + all_data[i]['phone'];
                            
							if (current_location['addr'] != ""){
								var tmp = GetDistance(current_location['coordinate'], all_data[i]['coordinate'], all_data[i])
								.then(function(result) {

									all_data[i] = result;
								  	console.log(all_data[i]);
								  	return result;
								}, function(reason) {
								  	alert('Failed: ' + reason);
								});
							} else {
								all_data[i]['distance'] = "";
							}

					}
		  			
				}
				deferred.resolve(all_data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.getAllLocation = function(){
		$scope.Clear();
		$scope.location_text = "All locations";
		current_location['coordinate'] = {};
		current_location['addr'] = '';

	}

	

	function GetDistance(origin, destination, tmp){
		var deferred = $q.defer();
		setTimeout(function() {
			var distance = "";
				var service = new google.maps.DistanceMatrixService();
				service.getDistanceMatrix(
				{
					origins: [origin],
					destinations: [destination],
					travelMode: google.maps.TravelMode.DRIVING,
				    unitSystem: google.maps.UnitSystem.METRIC,
				    avoidHighways: false,
				    avoidTolls: false
				}, function(response, status){
					if (status !== google.maps.DistanceMatrixStatus.OK) {
		            	alert('Error was: ' + status);
		            	deferred.reject('Error was: ' + status);

		          	} else {
		          		distance = response.rows[0].elements[0].distance.text;
		          		console.log(tmp['distance']);
		          		tmp['distance'] = distance;
		          		// tmp['distance'] = distance.replace(' km','');
		          		// tmp['distance'] = parseFloat(tmp['distance']);
		          		console.log(tmp['distance']);
		          		deferred.resolve(tmp);
		          	}
				});
		}, 10);
	    return deferred.promise;
	}

});

app.controller('CategoryListCtrl', function($scope, $http, $timeout, $q, $filter){
	console.log('CategoryListCtrl');
	var page = myNavigator.getCurrentPage();
	$scope.selected_category = page.options.selected_category;
	$scope.selected_category_key = page.options.selected_category_key;
	$scope.data_not_found = 0;
	//var search_city_en = "";
	//var search_city_en;
	//var current_latlng;
	//var orderBy = $filter('orderBy');
	//$scope.businesses = [];

	$scope.Clear = function(){
		$scope.search_result = 0;
		$scope.businesses = {};
		$scope.disabled = 0;
	}

	var current_location = [{
		addr: '', 
		coordinate: {}
	}];

	alert = function(msg) {
	    ons.notification.alert({
	      message: msg,
	      title: 'Vcess'
	    });
	}

	$scope.CurrentLocation = function(){
    	$scope.Clear();

    	getCurrentLocation().then(function(result) {
    		$scope.location_text = result['addr'];
    	}, function(error){
    		console.log(error);
    	});
    }

	getCurrentLocation = function(){
		var deferred = $q.defer();
		
		$timeout(function(){
	    	navigator.geolocation.getCurrentPosition(function(position) {
	    		var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
	    		var geocoder = new google.maps.Geocoder();
	    		geocoder.geocode({'location': latlng}, function(results, status) {
			          if (status === google.maps.GeocoderStatus.OK) {
			            if (results[1]) {
			            	current_location['coordinate'] = latlng;
			            	current_location['addr'] = results[1].formatted_address;
			            	deferred.resolve(current_location);
			            } else {
			              	console.log('No results found');
			              	deferred.reject('No results found');
			            }
			          } else {
			            deferred.reject('Geocoder failed due to: ' + status);
			          }
			        });
		      		        
				}, function(error){
					alert(error.message + " Please enable the location service.");
					deferred.reject('code: '    + error.code + ' ' + 'message: ' + error.message + '\n');
				});
    		},100);
		return deferred.promise;
	}

	OnLoad = function(){
		$scope.businesses = {};
		getCurrentLocation().then(function(result) {
    		//$scope.location_text = result['addr'];
    		//$scope.load_complete = 1;

    		$scope.location_text = result['addr'];

    		// $scope.selected_category = page.options.selected_category;
	// $scope.selected_category_key = page.options.selected_category_key;

    		$scope.search($scope.selected_category, $scope.selected_category_key, $scope.location_text);
    		// if (selected_keyword != undefined){
				//console.log(selected_keyword);
				// $scope.search_text = selected_keyword;
				//$scope.search($scope.search_text, $scope.location_text, 1);
			// } else {
				//$scope.load_complete = 1;	
			// }

    	}, function(error){
    		console.log(error);
    		$scope.load_complete = 1;
    	});
	}

	OnLoad();

	$scope.getAllLocation = function(){
		$scope.location_text = "All locations";
	}
	var no_distance = 0;

	$scope.search = function(selected_category, selected_category_key, location){
		

		if(selected_category_key === undefined){
    		selected_category_key = selected_category;
    	}

    	if (location === "All locations") {
    		location = "";
    	}
	    	GetData(selected_category, selected_category_key, location).then(function(result) {
	    		if (result.length == 0){
	    			$scope.search_result = 1;
	    			$scope.data_not_found = 1;
		    	} else {
		    		//console.log(result);
		    		$scope.businesses = result;
		    		$scope.data_not_found = 0;
		    		//$scope.predicate = 'distance';
		    		$scope.search_result = 1;
		    		if (result[0]['distance'] == ""){
		    			$scope.predicate = '-rate';
		    			no_distance = 1;
		    			$scope.disabled = 1;
		    		} else {
		    			$scope.predicate = 'distance';
		    			$scope.disabled = 0;
		    			no_distance = 0;
		    		}
		    	}
		    	$scope.load_complete = 1;
	    		
	    	});
    }

    $scope.SortBy =function(sort_item){
    	if (no_distance){
			alert('Specific source location required.');
		} else {
			$scope.predicate = sort_item;	
		}
    	
    }

    function GetSearchCity(addr){
    	var search_city;
    	if (addr.indexOf(',') > -1){
    		addr = addr.replace(/,/gi,'').split(" ");
			for (i = 0; i < addr.length; i++) { 
		    	if (addr[i].indexOf('-ku') > -1 || addr[i].indexOf('-shi') > -1){
		    		search_city = addr[i].replace(/-ku|-shi/gi,'');	
		    	}
			}
    	} else {
    		if (addr.indexOf('-ku') > -1 || addr.indexOf('-shi') > -1){
		    	search_city = addr.replace(/-ku|-shi/gi,'');	
		    } else {
		    	search_city = addr;
		    }
    	}
    	return search_city;
    }
   
	function GetData(selected_category, selected_category_key, location){
		console.log(location);  
		var deferred = $q.defer();
		var search_city = GetSearchCity(location);
		console.log(search_city);  

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { category: selected_category_key, city_en: search_city }
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);
				var all_data = data['data'];
				if (all_data.length == 0){
					//$scope.data_not_found = 1;
				} else {
					//var all_data = data['data'];
					for (i = 0; i < all_data.length; i++) { 
							all_data[i]['tel-phone'] = "tel:" + all_data[i]['phone'];
							if (current_location['addr'] != ""){
								var tmp = GetDistance(current_location['coordinate'], all_data[i]['coordinate'], all_data[i])
								.then(function(result) {

									all_data[i] = result;
								  	console.log(all_data[i]);
								  	return result;
								}, function(reason) {
								  	alert('Failed: ' + reason);
								});
							} else {
								all_data[i]['distance'] = "";
							}
					}
		  			
				}
				deferred.resolve(all_data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.getAllLocation = function(){
		$scope.Clear();
		$scope.location_text = "All locations";
		current_location['coordinate'] = {};
		current_location['addr'] = '';

	}
	// $scope.getCurrentLocation = function(){
 //    	$timeout(function(){
	// 	var latlng;
 //    	navigator.geolocation.getCurrentPosition(function(position) {
 //    		var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
 //    		console.log(latlng);
 //    		current_latlng = latlng;
 //    		var geocoder = new google.maps.Geocoder();
 //    		geocoder.geocode({'location': latlng}, function(results, status) {
	// 	          if (status === google.maps.GeocoderStatus.OK) {
	// 	            if (results[1]) {
	// 	            	$scope.$apply($scope.location_text =results[1].formatted_address);
	// 	            	//search_city_en = results[1].formatted_address.split(',')[1].replace(/-ku|-shi/gi,'').replace(' ','');
	// 	            	search_city_en = results[1].formatted_address;
	// 	            	console.log(search_city_en);
	// 	            } else {
	// 	              window.alert('No results found');
	// 	            }
	// 	          } else {
	// 	            window.alert('Geocoder failed due to: ' + status);
	// 	          }
	// 	        });
	      		        
	// 		}, function(error){
	// 			console.log('code: '    + error.code + ' ' + 'message: ' + error.message + '\n');
	// 			alert(error.message + " Please enable the location service.");
	// 		});
 //    	},10);
 //    }

    
 //    $scope.GetData = function(selected_category, selected_category_key, location){
 //    	if(selected_category_key === undefined){
 //    		selected_category_key = selected_category;

 //    	}
 //    	if (location === "All locations") {
 //    		location = "";
 //    	}
 //    	TEST(selected_category_key, location).then(function(result) {
 //    		console.log(result);
    		

 //    		//var tmp = orderBy(result, 'distance');
 //    		$scope.businesses = result;
 //    	});

    	
 //    }

   
	// function TEST(selected_category_key, location){
	// 	var deferred = $q.defer();
	// 	var tmp = "";
	
	// 	if (search_city_en == undefined){
	// 		tmp = location;
	// 		if (tmp.indexOf('-ku') > -1 || tmp.indexOf('-shi') > -1){
	// 		    tmp = tmp.replace(/-ku|-shi/gi,'');	
	// 		} 
	// 	} else {
	// 		console.log('location');
	// 		console.log(search_city_en);
	// 		search_city_en = search_city_en.replace(/,/gi,'').split(" ");
	// 		for (i = 0; i < search_city_en.length; i++) { 
	// 		    if (search_city_en[i].indexOf('-ku') > -1 || search_city_en[i].indexOf('-shi') > -1){
	// 		    	tmp = search_city_en[i].replace(/-ku|-shi/gi,'');	
	// 		    }
	// 		}
	// 	}
	// 	console.log(tmp);   
		
	// 	var req = {
	// 	 	method: 'POST',
	// 	 	url: 'http://www.vcess.com/ajax/search.php',
	// 	 	headers: {
	// 	   		'Content-Type': 'application/json'
	// 	 	},
	// 	 	data: { category: selected_category_key, city_en: tmp }
	// 	}

	// 	console.log(req);
			
	// 		$http(req).then(function(data){
	// 			console.log('req');
	// 			console.log(data);
	// 			if (data['data'].length == 0){
	// 				$scope.data_not_found = 1;
	// 			} else {
	// 				var all_data = data['data'];
	// 				for (i = 0; i < all_data.length; i++) { 
	// 						if (current_latlng != undefined){
	// 							var tmp = GetDistance(current_latlng, all_data[i]['coordinate'], all_data[i])
	// 							.then(function(result) {
	// 								all_data[i] = result;
	// 							  	console.log(all_data[i]);
	// 							  	return result;
	// 							}, function(reason) {
	// 							  	alert('Failed: ' + reason);
	// 							});
	// 						} 
	// 				}
	// 	  			deferred.resolve(all_data);
	// 			}
	// 		}, function(error){
	// 			deferred.reject('Error was: ' + error);
	// 		});
	// 	return deferred.promise;
	// }

	function GetDistance(origin, destination, tmp){
		var deferred = $q.defer();
		setTimeout(function() {
			var distance = "";
				var service = new google.maps.DistanceMatrixService();
				service.getDistanceMatrix(
				{
					origins: [origin],
					destinations: [destination],
					travelMode: google.maps.TravelMode.DRIVING,
				    unitSystem: google.maps.UnitSystem.METRIC,
				    avoidHighways: false,
				    avoidTolls: false
				}, function(response, status){
					if (status !== google.maps.DistanceMatrixStatus.OK) {
		            	alert('Error was: ' + status);
		            	deferred.reject('Error was: ' + status);
		            	//return deferred.promise;

		          	} else {
		          		distance = response.rows[0].elements[0].distance.text;
		          		tmp['distance'] = distance;
		          		deferred.resolve(tmp);
		          	}
				});
		}, 10);
	    return deferred.promise;
	}

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}
});

app.controller('AllCategoriesCtrl', function($scope, $http){
	console.log('AllCategoriesCtrl');

	var url = "http://www.vcess.com/ajax/get_data.php";
	GetAllCategories(); // Load all categories

	function GetAllCategories(){  
		console.log('GetAllCategories()');
	  	$http.post(url).success(function(data){
	  		$scope.categories = data;
	    });
	};

});

app.controller('HomeCtrl', function($scope, $http, GlobalParameters){
	console.log('Home Ctrl');
	$scope.top_keywords = ['Wifi', 'Electric Outlet', 'Stationary', 'Coffee', 'Beer', 'Wine', 'Juice', 'Umbrella', 'Shoes', 'Bag'];

	$scope.top_categories = [
		{name: 'Restaurant', key: 'restaurant'},
		{name: 'Coffee Shop', key: 'coffee'},
		{name: 'Supermarket', key: 'supermarket'},
		{name: 'Convenience Stores', key: 'convenience_store'},
		{name: 'Drug Store', key: 'drug_store'},
		{name: 'Department Store', key: 'department_store'},
		{name: 'Asian Ingredient Shop', key: 'asian_ingredient_shop'},
		{name: '100 Yen Shop', key: 'daiso'},
		{name: 'Discount Store', key: 'discount_store'}
	];

	$scope.search_home = GlobalParameters.search_home;
	$scope.shop_home = GlobalParameters.shop_home;
	$scope.shop_list_home = GlobalParameters.shop_list_home;
});



// app.controller('LoginCtrl', function($scope, localStorageService){
// 	console.log('Login Ctrl');

	
// 	$scope.alert = function(msg) {
//     	ons.notification.alert({message: msg, title: 'Vcess'});
// 	}
// });



app.controller('NormalIndexCtrl', function($scope, GlobalParameters, localStorageService){
	console.log('NormalIndexCtrl');
	console.log(localStorageService.get('login_user'));
	var login_user = localStorageService.get('login_user');
	if (login_user != null){
		GlobalParameters.current_user = login_user;
		GlobalParameters.login_status = 1;
	}

});

app.controller('LoginIndexCtrl', function($scope, GlobalParameters){
	console.log('LoginIndexCtrl');

});



app.controller('BusinessCtrl', function($scope, GlobalParameters){
	console.log('BusinessCtrl');
	var page = myNavigator.getCurrentPage();
	//GlobalParameters.SetIsBusiness(page.options.is_business);

	$scope.selected_category = page.options.selected_category;
	$scope.selected_business = page.options.selected_biz;




});


app.controller('BusinessIndexCtrl', function($scope, GlobalParameters){
	console.log('BusinessIndexCtrl');
	var page = myNavigator.getCurrentPage();
	GlobalParameters.SetIsBusiness(page.options.is_business);
});

app.controller('InboxCtrl', function($scope, GlobalParameters){
	console.log('InboxCtrl');

	$scope.login_status = GlobalParameters.login_status;

	$scope.getRate = function(num) {
		return new Array(num);   
	}
});



app.controller('ItemSetsCtrl', function($scope, $q, $http){
	console.log('ItemSetsCtrl');
	
	function GetItemSet(categories){
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { categories: categories}
		}

		console.log(req);
		$http(req).then(function(data){
			//console.log(data['data'].length);
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function LoadData(){
		var biz_categories = myNavigator.getCurrentPage().options.biz_category;
		var categories = biz_categories.split(', ');
	    GetItemSet(categories).then(function(result) {
	    	if (result.length == 0){
	    		$scope.data_not_found = 1;
	    	} else {
	    		$scope.data_not_found = 0;
	    		$scope.item_sets = result;	
	    	}
    		$scope.load_complete = 1;
    	}, function(error){
    		console.log(error);
    		$scope.features = {};
    	});
	}

	LoadData();
});

app.controller('FeaturesCtrl', function($scope, $q, $http){
	console.log('FeaturesCtrl');
	
	function GetBizFeatures(biz_id){
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { biz_id: biz_id}
		}
		$http(req).then(function(data){
			// console.log('req');
			console.log(data['data']);
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function LoadData(){
		var biz_id = myNavigator.getCurrentPage().options.biz_id;
		GetBizFeatures(biz_id).then(function(result) {
			console.log(result['business_id']);
    		//$scope.features = result;
    	}, function(error){
    		console.log(error);
    		$scope.features = {};
    	});
	}

	LoadData();
});


app.controller('BusinessHomeCtrl', function($scope, $timeout, $window, $q, $http, GlobalParameters){
	console.log('BusinessHomeCtrl');
	$scope.OpenLink = function(url){
		if (url != ""){
			$window.open(url, '_blank');
		}
        
        // url = 'https://www.facebook.com/dialog/oauth?client_id=1687245944857278&redirect_uri=https://www.facebook.com/connect/login_success.html&display=touch';
        // $window.open(url, '_blank');
	}
	var page = myNavigator.getCurrentPage();
	selected_business = page.options.selected_biz;
	console.log(selected_business['business_id']);
	LoadData();

	$scope.Favorite = function(biz_id){
		console.log('Favorite');
		if (GlobalParameters.login_status) {
			var current_user = GlobalParameters.current_user;
			var new_favorite = parseInt(selected_business['favorite']) + 1;
			
			Write(selected_business['views'], new_favorite, selected_business['rate'], biz_id).then(function(result) {
				$scope.alert('Thank for your feedback!');
				$scope.business['favorite'] = new_favorite;
	    	}, function(error){
	    		console.log(error);

	    	});
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	function Write(views, favorites, rates, biz_id) {
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/write.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { biz_id: biz_id, views: views, favorite: favorites, rate: rates}
		}
		$http(req).then(function(data){
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function UpdateViewCount(){
		var new_view = parseInt(selected_business['views']) + 1;
		var biz_id = selected_business['business_id'];
		Write(new_view, selected_business['favorite'], selected_business['rate'], biz_id).then(function(result) {
			selected_business['views'] = new_view;
    	}, function(error){
    		console.log(error);

    	});
	} 

	$scope.GetDirection = function (latlng){
		url = "http://maps.google.com/?q=" + latlng;
		//$window.location.href = url;
		$window.open(url, '_system');
	}

	function ShowMap(lat, lng){
		$timeout(function(){
	       	$scope.markers = [];
    		$scope.markerId = 1;
	    	var latlng;
	    	latlng = new google.maps.LatLng(lat, lng);
		      	var myOptions = {
		            zoom: 14,
		            center: latlng,
		            mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        var map = new google.maps.Map(document.getElementById("map_biz"), myOptions); 
		      	var marker = new google.maps.Marker({
		          position: latlng,
		          map: map
		        });
		        map.setCenter(latlng);
	    },100);
	}

	function LoadData(){
		UpdateViewCount();
        
		if (selected_business['rate'] % 1 == 0)
        	$scope.show_half_star = 0;
        else
        	$scope.show_half_star = 1;

        if (selected_business['favorite'] == "")
	        selected_business['favorite'] = 0;


	    if (selected_business['owner'] == "")
	        selected_business['owner'] = "N/A";

	    var coordinate = selected_business['coordinate'].split(',');
	    ShowMap(coordinate[0], coordinate[1]);

	    $scope.business = selected_business;
	}

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	$scope.alert = function(msg) {
    	ons.notification.alert({message: msg, title: 'Vcess'});
	}

	$scope.confirm = function(msg) {
	    ons.notification.confirm({
	      	message: msg,
	      	title: 'Vcess',
	      	callback: function(idx) {
	        switch (idx) {
	          	case 0:
	            	// ons.notification.alert({
	             //  		message: 'You pressed "Cancel".',
	            	// });
	            	break;
	          	case 1:
	            	// ons.notification.alert({
	             //  		// message: 'You pressed "OK".',
	            	// });
	            	$scope.myNavigator.pushPage('login_index.html');
	            break;
	        }
	      }
	    });
	}


	


	// $scope.biz = {
	// 	name: "",
	// 	rate: 0,
	// 	favorite: 0,
	// 	owner: "N/A",
	// 	addr: "",
	// 	phone: "",
	// 	website: "",
	// 	coordiate: {
	// 		lat: "",
	// 		lng: ""
	// 	}
	// };

	// $scope.show_half_star = 0;
	// //console.log('BusinessHomeCtrl');
	// //var page = myNavigator.getCurrentPage();
	// //$scope.selected_biz = page.options.selected_biz;
	// //GlobalParameters.SetIsBusiness(page.options.is_business);
	// //GlobalParameters.setSelectedBiz(page.options.selected_biz);

	// var url = "http://www.vcess.com/ajax/get_data.php";
	// $scope.my_items = "data";
	// console.log(url);
	// var coordinate = {};
	// //getItem(); // Load all available items 


	// function getItem(){  
	// 	console.log('getItem1');
	//   	$http.post(url).success(function(data){
	//   		//console.log(data[0]['business_id']);
	//         $scope.biz.name = data[0]['name_en'];

	//         $scope.biz.rate = data[0]['rate'];
	//         $scope.getRate = function(num) {
	// 			return new Array(num);   
	// 		}
	//         if ($scope.biz.rate % 1 == 0)
	//         	$scope.show_half_star = 0;
	//         else
	//         	$scope.show_half_star = 1;

	//         if (data[0]['favorite'] !== "")
	//         	$scope.biz.favorite = data[0]['favorite'];
	       

	//         if (data[0]['owner'] !== "")
	//         	$scope.biz.owner = data[0]['owner'];

	//         $scope.biz.addr = data[0]['st_addr_en'] + " " + data[0]['city_en'] +  " " + data[0]['state_en'] +  " " + data[0]['zip_code'];
	//         $scope.biz.phone = data[0]['phone'];
	//         $scope.biz.website = data[0]['website'];
	//         $scope.biz.coordinate = data[0]['coordinate'];
	//         coordinate = data[0]['coordinate'].split(',');
	

	//         $timeout(function(){
	//        	$scope.markers = [];
 //    		$scope.markerId = 1;
	//     	var latlng;
	//     	latlng = new google.maps.LatLng(coordinate[0], coordinate[1]);
	// 	      	var myOptions = {
	// 	            zoom: 14,
	// 	            center: latlng,
	// 	            mapTypeId: google.maps.MapTypeId.ROADMAP
	// 	        };
	// 	        var map = new google.maps.Map(document.getElementById("map_biz"), myOptions); 
	// 	      	var marker = new google.maps.Marker({
	// 	          position: latlng,
	// 	          map: map
	// 	        });
	// 	        map.setCenter(latlng);
	//     },100);

	//     });
	// };

	
    
});

app.controller('NewBusinessCtrl', function($scope){
	console.log('NewBusinessCtrl');
	$scope.myDate = new Date();

	$scope.show_country_list = 0;
	$scope.current_country = "Japan";
	$scope.country = "Cambodia";

	$scope.SelectCountry = function(selected_country){
		$scope.show_country_list = 0;
		$scope.country = $scope.current_country;
		$scope.current_country = selected_country;
	}

});

app.controller('NewBusinessCtrlSub1', function($scope){
	$scope.showCurrent = 0;
	console.log('NewBusinessCtrlSub1');
	var page = myNavigator.getCurrentPage();
	$scope.Address = page.options.addr;

	$scope.ShowCurrentLocation = function(){
		$scope.Address = "current";		
	}
});


app.controller('ItemsCtrl', function($scope){
	var X = XLSX;

	$scope.process_wb = function(wb) {
		//var output = "";
		
		//output = JSON.stringify($scope.to_json(wb), 2, 2);
		//output = $scope.to_json(wb);
		//output = $scope.to_csv(wb);		

		// if(out.innerText === undefined) out.textContent = output.Sheet1[1].Goods;
		// else out.innerText = output.Sheet1[1].Goods;
		return output;
	}

	$scope.filter_data = function(sheet_name, filter_column, data){

		var result = "";
		angular.forEach(data[sheet_name], function(value, key) {
			//alert(JSON.stringify(value[filter_column]));
			result = result + JSON.stringify(value[filter_column]) + "\n";
		});

		out.innerText = result;
	}

	$scope.to_csv = function(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(csv.length > 0){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		});
		return result.join("\n");
	}

	$scope.to_json = function(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}

	$scope.fileNameChanged = function(e) {
		var output = [];
	   	var files = e.files;
	  	var f = files[0];
	   	var reader = new FileReader();
	   	var name = f.name;
	   	{
		   	reader.onload = function(e){
			   	var wb;
			   	var data = e.target.result;
			   	wb = X.read(data, {type: 'binary'});
			   	output = $scope.to_json(wb);
			   	$scope.filter_data($scope.SheetName, $scope.ColumnName, output);
		   	};	
		   	reader.readAsBinaryString(f);
	   	}
	   	
	   	
	}

});

app.controller('NewsFeedCtrl', function($scope, GlobalParameters){
	console.log('NewsFeedCtrl');
	$scope.login_status = GlobalParameters.login_status;
});

app.controller('MeetUpCtrl', function($scope, GlobalParameters){
	console.log('MeetUpCtrl');
	$scope.login_status = GlobalParameters.login_status;
});

app.controller('ProfileCtrl', function($scope, GlobalParameters, localStorageService){
	console.log('Profile Ctrl');

	$scope.login_status = GlobalParameters.login_status;
	var page = myNavigator.getCurrentPage();
	//$scope.login_user = page.options.login_user;	
	$scope.login_user = GlobalParameters.current_user;

	// $scope.is_business = GlobalParameters.is_business;
	// console.log($scope.is_business
	$scope.Logout = function(){
		GlobalParameters.login_status = 0;
		$scope.myNavigator.pushPage('normal_index.html');
		localStorageService.remove('login_user');
	}
});

app.controller('PropertiesCtrl', function($scope, GlobalParameters){
	GlobalParameters.SetIsOwner(1);
});



app.controller('BusinessListCtrl', function($scope, GlobalParameters){
	//GlobalParameters.SetIsOwner(0);
	$scope.alert = function(msg) {
    	ons.notification.alert({message: msg, title: 'Vcess'});
	}
});

app.controller('FriendListCtrl', function($scope, GlobalParameters){
	//GlobalParameters.SetIsOwner(0);
	$scope.alert = function(msg) {
    	ons.notification.alert({message: msg, title: 'Vcess'});
	}
});

app.controller('IndexCtrl', function($scope, GlobalParameters){
	GlobalParameters.SetIsOwner(0);
});

app.controller('SettingsCtrl', function($scope, GlobalParameters){

	$scope.SetShopListHome = function(){
		GlobalParameters.SetHomePage(0,1,0);
	};
	$scope.SetShopHome = function(){
		GlobalParameters.SetHomePage(0,0,1);
	};
	$scope.SetSearchHome = function(){
		GlobalParameters.SetHomePage(1,0,0);
	};
	
});