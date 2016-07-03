//var app = angular.module('myApp',['onsen','ngMaterial']);

var app = ons.bootstrap('myApp', ['onsen', 'LocalStorageModule']);

// app.config(function(FacebookProvider) {
//      // Set your appId through the setAppId method or
//      // use the shortcut in the initialize method directly.
//      FacebookProvider.init('1687245944857278');
// });

// app.config(function (localStorageServiceProvider) {
//   localStorageServiceProvider
//     .setStorageType('sessionStorage');
// });

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.service('GlobalParameters', function(){
    
	this.search_home = 1;
	this.shop_list_home = 0;
	this.shop_home = 0;
	this.is_owner = 0;  
	this.is_business = 0;
	this.selected_biz="";
	this.login_status = 0;
	this.current_user = {};
	this.lang = "en";

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
	this.setLang = function(value){
		this.lang = value;
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
	//console.log(FB);

	$scope.SignUpWithFacebook = function(){
		alert('signup');
		Facebook.login(function(response) {
        	console.log(response);
      	});
		// FB.getLoginStatus(function(response) {
		// console.log(response);			
		//   if (response.status === 'connected') {
		//     console.log('Logged in.');
		//   }
		//   else {
		//     FB.login();
		//   }
		// });

	// 	FB.login(function(response) {
	//     if (response.authResponse) {
	//     	console.log('Welcome!  Fetching your information.... ');
	//     	FB.api('/me', function(response) {
	//        	console.log('Good to see you, ' + response.name + '.');
	//      });
	//     } else {
	//      	//console.log('User cancelled login or did not fully authorize.');
	//      	//url = 'https://www.facebook.com/dialog/oauth?client_id=1687245944857278&redirect_uri=https://www.facebook.com/connect/login_success.html&display=touch';
 //        	//$window.open(url);
	//     }
	// }, {scope: 'email,user_likes'});
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

	//console.log(FB);

	$scope.SendEmail = function(email){
		alert("A password recovery email has been sent.");
		$scope.myNavigator.pushPage('pages/en/profile_index.html');
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
					$scope.myNavigator.pushPage('pages/en/profile_index.html', {login_user: login_user});
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

	var original_result = {};

	$scope.data_not_found = 0;
	//var orderBy = $filter('orderBy');

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
	    		//var latlng = {lat: 11.5545345, lng: 104.8992934};

	    		var geocoder = new google.maps.Geocoder();
	    		//'address': address
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

	AddrToCoordinate = function(addr){
		console.log('addr2coordinate');
		
		var deferred = $q.defer();
		var geocoder = new google.maps.Geocoder();
	    		
		//var address = "phnom penh";
		$timeout(function(){
			geocoder.geocode({'address': addr}, function(results, status) {
				console.log('OK');
	          	if (status === google.maps.GeocoderStatus.OK) {
	          		console.log(results);
		            if (results[0]) {
		            	current_location['coordinate']['lat'] = results[0].geometry.location.lat();
		            	current_location['coordinate']['lng'] = results[0].geometry.location.lng();
		            	//deferred.resolve(current_location);
		            } else {
		              	console.log('No results found');
		              	//deferred.reject('No results found');
		            }
	          	} else {
	          		console.log('Geocoder failed due to: ' + status);
	            	//deferred.reject('Geocoder failed due to: ' + status);
	          	}
	        });
		},100);
	}

	$scope.search = function(search_text, location, search_item_flag){
		$scope.Clear();
    	console.log(search_text);

    	if (search_text == undefined) {
    		alert('Please input your search keyword.');
    	} else {
    		// var keyword = MatchKeyword(search_text);

    		if (location === "All locations") {
	    		location = "";
	    	}
	    	GetData(search_text, location, search_item_flag).then(function(result) {
	    		$scope.count_result = Object.getOwnPropertyNames(result['data']).length
	    		console.log($scope.count_result);
	    		// $scope.businesses = result;
	    		// $scope.predicate = 'distance';
	    		// $scope.search_result = 1;
	    		if ($scope.count_result == 0){
	    			$scope.search_result = 1;
	    			$scope.data_not_found = 1;
	    			$scope.load_complete = 1;
	    		} else {
	    			$scope.PopList = 1;
	    			original_result = result['data'];
	    			$scope.businesses = result['data'];
	    			if (result['pop_list'].length ==0){
	    				$scope.PopList = 0;
	    			}
	    			$scope.pop_list = result['pop_list'];
		    		$scope.data_not_found = 0;
		    		//$scope.predicate = 'distance';
		    		$scope.search_result = 1;
		    		if (result['data'][0]['distance'] == ""){
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
		var page = myNavigator.getCurrentPage();
		var selected_keyword = page.options.keyword;

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

    	// if ($scope.selected_keyword) {
    	// 	search(selected_keyword, location_text, true)
    	// }
	}

	var selected_keyword = myNavigator.getCurrentPage().options.keyword;	
	OnLoad();

    $scope.CurrentLocation = function(){
    	console.log('current');
    	$scope.Clear();

    	getCurrentLocation().then(function(result) {
    		$scope.location_text = result['addr'];
    	}, function(error){
    		console.log(error);
    	});
    }

    var no_distance = 0;

    function SortByPhotos(){
    	$scope.businesses = $scope.pop_list;
    }

    $scope.SortBy =function(sort_item){

    	if (sort_item == "-rate"){
    		SortByPhotos();
    	} else {
    		$scope.businesses = original_result;
    		$scope.predicate = sort_item;	
    	}
		console.log(sort_item);
    }

    function GetSearchCity(addr){
    	var search_city;

    	if (addr != current_location['addr']){
    		if (addr == "Phnom Penh") {
    			current_location['coordinate']['lat'] = 11.57609;
		        current_location['coordinate']['lng'] = 104.92319;
		        search_city = addr;
		    } else if (addr == "Independence Monument") {
    			current_location['coordinate']['lat'] = 11.556359;
		        current_location['coordinate']['lng'] = 104.928143; 
		        search_city = "Phnom Penh";
		    } else if (addr == "Psar Thmey") {
    			current_location['coordinate']['lat'] = 11.56966;
		        current_location['coordinate']['lng'] = 104.92117; 
		        search_city = "Phnom Penh";
    		} else {
    			AddrToCoordinate(addr);
    			search_city = addr;
    		}
    		
    	} else {
    		var tmp = addr.split(", ");
    		search_city = tmp[tmp.length - 2];
    	}
    	return search_city;
    }

    function MatchKeyword (search_text){
    	var deferred = $q.defer();
    	var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/synonym.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	}
		}

		console.log(req);
		$http(req).then(function(data){
			var all_data = data['data'];
			for (i = 0; i < all_data.length; i++) { 
				var found = all_data[i]['synonym'].includes(search_text);
				if (found==true){
					console.log(all_data[i]['keyword']);
					var result = all_data[i]['keyword'];
					deferred.resolve(result);
					return deferred.promise;
				}
					
			}
		});
		deferred.resolve(search_text);
		return deferred.promise;
    }
   
	function GetData(search_text, location, search_item_flag){
		console.log('GetData'); 
		console.log(search_text);  
		var deferred = $q.defer();
		var search_city = GetSearchCity(location);
		//var search_city = location;
		console.log(search_city);  

		// MatchKeyword(search_text).then(function(data){
		// 	console.log('MatchKeyword');
		// 	console.log(data);
		// 	search_text = data;
		// });

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { keyword: search_text, city_en: search_city, search_item_flag: search_item_flag, lat: current_location['coordinate']['lat'], lng: current_location['coordinate']['lng']}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);

				data['pop_list'] = data['data']['pop_list'];
				delete data['data']['pop_list'];
				var all_data = data;


				// if (all_data.length == 0){
				// 	//$scope.data_not_found = 1;
				// 	//alert('data_not_found');
				// } else {
					
				// 	// for (i = 0; i < all_data.length; i++) { 
				// 	// 		all_data[i]['tel-phone'] = "tel:" + all_data[i]['phone'];
                            
				// 	// 		if (current_location['addr'] != ""){
				// 	// 			var tmp = GetDistance(current_location['coordinate'], all_data[i]['coordinate'], all_data[i])
				// 	// 			.then(function(result) {

				// 	// 				all_data[i] = result;
				// 	// 			  	console.log(all_data[i]);
				// 	// 			  	return result;
				// 	// 			}, function(reason) {
				// 	// 			  	alert('Failed: ' + reason);
				// 	// 			});
				// 	// 		} else {
				// 	// 			all_data[i]['distance'] = "";
				// 	// 		}

				// 	// }
		  			
				// }
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
	var original_result = {};
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
	    		//var latlng = {lat: 11.5545345, lng: 104.8992934};
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

	AddrToCoordinate = function(addr){
		console.log('addr2coordinate');
		
		var deferred = $q.defer();
		var geocoder = new google.maps.Geocoder();
	    		
		//var address = "phnom penh";
		$timeout(function(){
			geocoder.geocode({'address': addr}, function(results, status) {
				console.log('OK');
	          	if (status === google.maps.GeocoderStatus.OK) {
	          		console.log(results);
		            if (results[0]) {
		            	current_location['coordinate']['lat'] = results[0].geometry.location.lat();
		            	current_location['coordinate']['lng'] = results[0].geometry.location.lng();
		            	//deferred.resolve(current_location);
		            } else {
		              	console.log('No results found');
		              	//deferred.reject('No results found');
		            }
	          	} else {
	          		console.log('Geocoder failed due to: ' + status);
	            	//deferred.reject('Geocoder failed due to: ' + status);
	          	}
	        });
		},100);
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
	    		$scope.count_result = Object.getOwnPropertyNames(result['data']).length
	    		console.log($scope.count_result);
	    		if ($scope.count_result == 0){
	    			$scope.search_result = 1;
	    			$scope.data_not_found = 1;
		    	} else {
		    		$scope.PopList = 1;
		    		original_result = result['data'];
	    			$scope.businesses = result['data'];
	    			if (result['pop_list'].length ==0){
	    				$scope.PopList = 0;
	    			}
	    			$scope.pop_list = result['pop_list'];
		    		
		    		$scope.data_not_found = 0;
		    		//$scope.predicate = 'distance';
		    		$scope.search_result = 1;
		    		if (result['data'][0]['distance'] == ""){
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

    function SortByPhotos(){
    	$scope.businesses = $scope.pop_list;
    }

    $scope.SortBy =function(sort_item){

    	if (sort_item == "-rate"){
    		SortByPhotos();
    	} else {
    		$scope.businesses = original_result;
    		$scope.predicate = sort_item;	
    	}
		console.log(sort_item);
    }

    function GetSearchCity(addr){
    	var search_city;

    	if (addr != current_location['addr']){
    		if (addr == "Phnom Penh") {
    			current_location['coordinate']['lat'] = 11.57609;
		        current_location['coordinate']['lng'] = 104.92319;
		        search_city = addr;
		    } else if (addr == "Independence Monument") {
    			current_location['coordinate']['lat'] = 11.556359;
		        current_location['coordinate']['lng'] = 104.928143; 
		        search_city = "Phnom Penh";
		    } else if (addr == "Psar Thmey") {
    			current_location['coordinate']['lat'] = 11.56966;
		        current_location['coordinate']['lng'] = 104.92117; 
		        search_city = "Phnom Penh";
    		} else {
    			AddrToCoordinate(addr);
    			search_city = addr;
    		}
    		
    	} else {
    		var tmp = addr.split(", ");
    		search_city = tmp[tmp.length - 2];
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
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { category: selected_category_key, city_en: search_city, lat: current_location['coordinate']['lat'], lng: current_location['coordinate']['lng']}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);

				data['pop_list'] = data['data']['pop_list'];
				delete data['data']['pop_list'];
				var all_data = data;

				// if (all_data.length == 0){
				// 	//$scope.data_not_found = 1;
				// } else {
				// 	//var all_data = data['data'];
				// 	for (i = 0; i < all_data.length; i++) { 
				// 			all_data[i]['tel-phone'] = "tel:" + all_data[i]['phone'];
				// 			if (current_location['addr'] != ""){
				// 				var tmp = GetDistance(current_location['coordinate'], all_data[i]['coordinate'], all_data[i])
				// 				.then(function(result) {

				// 					all_data[i] = result;
				// 				  	console.log(all_data[i]);
				// 				  	return result;
				// 				}, function(reason) {
				// 				  	alert('Failed: ' + reason);
				// 				});
				// 			} else {
				// 				all_data[i]['distance'] = "";
				// 			}
				// 	}
		  			
				// }
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
	$scope.top_keywords = ['Khmer Food', 'Japanese Food', 'Chinese Food', 'Coffee', 'Bubble Tea', 'Soup'];

	$scope.top_categories = [
		{name: 'Khmer Restaurants', key: 'khmer'},
		{name: 'Coffee Shops', key: 'coffee'},
		{name: 'Chinese Restaurants', key: 'chinese'},
		{name: 'Green & Bubble Tea', key: 'tea'},
		{name: 'BBQ Restaurants', key: 'bbq'},
		{name: 'Bars & Pubs', key: 'bars'},
		{name: 'Soup', key: 'soup'},
		{name: 'Fast Food', key: 'fast'}
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

	$scope.RateIcon = {
		"1": 'fa-star-o', 
		"2": 'fa-star-o', 
		"3": 'fa-star-o', 
		"4": 'fa-star-o', 
		"5": 'fa-star-o'
	};
	$scope.current_star = 0;
	var current_user = GlobalParameters.current_user;
    
    $scope.Call = function(url){
        $window.location.href = url;
    }
    
	$scope.OpenLink = function(url){
		if (url != ""){
			$window.open(url, '_blank');
		}
        
	}
	var page = myNavigator.getCurrentPage();
	selected_business = page.options.selected_biz;
	console.log(selected_business['id']);
	LoadData();

	$scope.RateStar = function(star_pos){
		$scope.current_star = star_pos;
		for (i=1;i<=star_pos;i++){
			$scope.RateIcon[i] = "fa-star";
		}
		for (i=5;i>star_pos;i--){
			$scope.RateIcon[i] = "fa-star-o";
		}
	}

	$scope.Favorite = function(biz_id, current_fav){
		console.log('Favorite');
		if (GlobalParameters.login_status) {
			console.log(current_user['favorite']);
			if (Find(current_user['favorite'], biz_id)){
				$scope.alert('You have already favorited this place.');
			} else {
				var new_favorite = parseInt(current_fav) + 1;
				var param = "favorite";
				var value = new_favorite;
				var user_value = current_user['favorite'] + "," + biz_id;
				var user_id = current_user['user_id'];
				
				UpdateDB(param, value, user_value, biz_id, user_id).then(function(result) {
					//$scope.alert('Thanks for your feedback!');
					$scope.fav_color = {'color':'red'};
					$scope.business['favorite'] = new_favorite;
					current_user['favorite'] = user_value;
					GlobalParameters.setCurrentUser(current_user);

		    	}, function(error){
		    		console.log(error);

		    	});	
			}
			
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.WishList = function(biz_id, current_wish_list){
		console.log('WishList');
		if (GlobalParameters.login_status) {
			
			if (Find(current_user['wish_list'], biz_id)){
				$scope.alert('You have already added this place to your wish list.');
			} else {
				var new_wish_list = parseInt(current_wish_list) + 1;
				var param = "wish_list";
				var value = new_wish_list;
				var user_value = current_user['wish_list'] + "," + biz_id;
				var user_id = current_user['user_id'];
				
				UpdateDB(param, value, user_value, biz_id, user_id).then(function(result) {
					//$scope.alert('Thanks for your feedback!');
					$scope.wish_color = {'color':'red'};
					$scope.business['wish_list'] = new_wish_list;
					current_user['wish_list'] = user_value;
					GlobalParameters.setCurrentUser(current_user);

		    	}, function(error){
		    		console.log(error);

		    	});	
			}
			
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.Rate = function(biz_id, rate_star){
		console.log('Rate');
		if (GlobalParameters.login_status) {
			
			var param = "rate";
			var value = rate_star;
			var user_value = current_user['rate'] + "," + biz_id;
			var user_id = current_user['user_id'];
		
			UpdateDB(param, value, user_value, biz_id, user_id).then(function(result) {

				$scope.alert('Thanks for your feedback!');
				$scope.rate_color = {'color':'red'};
				$scope.ShowRate = 0;
				$scope.business['rate'] = rate_star;
				current_user['rate'] = user_value;
				GlobalParameters.setCurrentUser(current_user);

	    	}, function(error){
	    		console.log(error);

	    	});	
			
			
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.Review = function(biz_id, review){
		console.log('Review');
		if (GlobalParameters.login_status) {
			
			var user_id = current_user['user_id'];
		
			UpdateDBReview(review, biz_id, user_id).then(function(result) {

				$scope.alert('Thanks for your feedback!');
				$scope.review_color = {'color':'red'};
				$scope.ShowReview = 0;
	    	}, function(error){
	    		console.log(error);

	    	});	
			
			
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	function UpdateDBReview(review, biz_id, user_id){
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/write.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { update_review_flag: 1, review: review, biz_id: biz_id, user_id: user_id}
		}
		console.log(req);

		$http(req).then(function(data){
			console.log(data);
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function Find(list, item){
		console.log(list);
		console.log(item);
		var result=false;
		var tmp = list.split(",");
		for (i = 0; i < tmp.length; i++) { 
		    if (tmp[i]==item){
		    	result=true;
		    	break;
		    }
		}
		return result;	
	}

	function UpdateDB(param, value, user_value, biz_id, user_id){
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/write.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { update_db_flag: 1, biz_id: biz_id, user_id: user_id, param: param, value: value, user_value: user_value}
		}
		console.log(req);

		$http(req).then(function(data){
			console.log(data);
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function UpdateDBView(views, biz_id){
		var deferred = $q.defer();
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/write.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { update_view_flag: 1, views: views, biz_id: biz_id}
		}
		console.log(req);

		$http(req).then(function(data){
			console.log(data);
			deferred.resolve(data['data']);
		}, function(error){
			deferred.reject('Error was: ' + error);
		});
		return deferred.promise;
	}

	function UpdateViewCount(){
		var new_view = parseInt(selected_business['views']) + 1;
		var biz_id = selected_business['id'];
		selected_business['views'] = new_view;
		UpdateDBView(new_view, biz_id).then(function(result) {
		//	selected_business['views'] = new_view;
			//alert(result);
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

	function GetPhotos(biz_id, num_photos){
		$scope.food_images = [];
		$scope.menu_images = [];
		$scope.store_images = [];

		if (num_photos > 0){
			var img = {};
			GetData(biz_id).then(function(result) {
				console.log(result);
				for (i = 1; i <= num_photos; i++) {
					//all_images[i-1] = "http://www.vcess.com/shops/" + biz_id + "/" + result[i]['id'] + ".jpg";
					photo_path = "http://www.vcess.com/shops/" + biz_id + "/" + result[i]['id'] + ".jpg";
					photo_title = result[i]['name_en'];
					img = {
						"path" : photo_path,
						"name_en" : photo_title
					};

					if (result[i]['type'] == "Food"){
						$scope.food_images.push(img);
					} else if (result[i]['type'] == "Shop"){
						$scope.store_images.push(img);
					} else {
						$scope.menu_images.push(img);
					}

				}	

		    }, function(error){
	    		console.log(error);
		    });	
		}
	}

	function GetData(biz_id){
		var deferred = $q.defer();

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: {get_photos_flag: 1, biz_id: biz_id}
		}

		console.log(req);
			$http(req).then(function(data){
				deferred.resolve(data['data']);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
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
	    //console.log(selected_business);
	    $scope.business = selected_business;
	    GetPhotos(selected_business['id'], selected_business['photos']);

	    if (Find(current_user['favorite'], selected_business['id'])){
	    	$scope.fav_color = {'color':'red'};
	    }

	    if (Find(current_user['wish_list'], selected_business['id'])){
	    	$scope.wish_color = {'color':'red'};	
	    }
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
		//$scope.myNavigator.pushPage('en/normal_index.html');
		$scope.myNavigator.resetToPage('pages/en/normal_index.html');
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

app.controller('LanguagesCtrl', function($scope, GlobalParameters){
	console.log("LanguagesCtrl");

	var cur_lang = GlobalParameters.lang;
	if (cur_lang == "en"){
		document.getElementById("english").checked = true;
	} else if (cur_lang == "kh") {
		document.getElementById("khmer").checked = true;
	}
	
	$scope.ChangeLang = function (lang){
		GlobalParameters.setLang(lang);
		cur_lang = lang;
	}

	$scope.Save = function(){
		if (cur_lang == "en"){
			$scope.myNavigator.resetToPage('pages/en/normal_index.html');
		} else if (cur_lang == "kh") {
			$scope.myNavigator.resetToPage('pages/kh/normal_index.html');
		}
	}
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


app.controller('FavCtrl', function($scope, GlobalParameters, $q, $http){
	console.log('FavCtrl');

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	$scope.login_status = GlobalParameters.login_status;
	var current_user = GlobalParameters.current_user;

	$scope.FavList = function(){
		var fav_list = current_user['favorite'];
		if (fav_list == ""){
			$scope.EmptyList = 1;
		} else {
			GetData(fav_list).then(function(result) {
				$scope.businesses = result;
				$scope.LoadComplete = 1;
			});
		}
	}

	$scope.WishList = function(){
		var wish_list = current_user['wish_list'];
		if (wish_list == ""){
			$scope.EmptyList = 1;
		} else {
			GetData(wish_list).then(function(result) {
				$scope.businesses = result;
				$scope.LoadComplete = 1;
			});
		}
	}

	function GetData(biz_id_list){
		var deferred = $q.defer();

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: {find_biz_flag: 1, biz_id_list: biz_id_list}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);
				var all_data = data['data'];
				deferred.resolve(all_data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.FavList();

});

app.controller('RateCtrl', function($scope, GlobalParameters, $q, $http){
	console.log('RateCtrl');

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	$scope.login_status = GlobalParameters.login_status;
	var current_user = GlobalParameters.current_user;

	$scope.RateList = function(){
		
		GetData(current_user['user_id'], "rate").then(function(result) {
			if (result.length > 0){
				console.log(result);
				$scope.businesses = result;
				$scope.LoadComplete = 1;
			} else {
				$scope.EmptyList = 1;		
			}
			
		});
		
	}


	$scope.ReviewList = function(){
		GetData(current_user['user_id'], "review").then(function(result) {
			if (result.length > 0){
				$scope.businesses = result;
				$scope.LoadComplete = 1;
			} else {
				$scope.EmptyList = 1;		
			}
			
		});
	}

	function GetData(user_id, param){
		var deferred = $q.defer();

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: {find_review_rate_flag: 1, param: param, user_id: user_id}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);
				var all_data = data['data'];
				deferred.resolve(all_data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.RateList();
});

app.controller('ReviewsCtrl', function($scope, GlobalParameters, $q, $http){
	console.log('ReviewsCtrl');
	var page = myNavigator.getCurrentPage();
	var biz_id = page.options.biz_id;

	function GetData(){
		var deferred = $q.defer();

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: {get_review_flag: 1, biz_id: biz_id}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log('req');
				console.log(data);
				var all_data = data['data'];
				deferred.resolve(all_data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	function OnLoad(){
		GetData().then(function(result) {
			$scope.reviews = result;
		});
	}

	OnLoad();
});