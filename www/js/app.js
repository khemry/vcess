var app = ons.bootstrap('myApp', ['LocalStorageModule']);

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
		console.log('YES');
		this.current_user = value;
	}
	this.setLang = function(value){
		this.lang = value;
	}
});

// app.service('MsgService', ['$window', function(win) {
//    	var msgs = [];
//    	return function(msg) {
//     	ons.notification.alert({message: msg});
//    	};
// }]);
app.controller('AuthCtrl', function($scope){
	console.log('AuthCtrl');
	$scope.origin = myNavigator.getCurrentPage().options.origin;
	$scope.selected_business = myNavigator.getCurrentPage().options.selected_business;
});

app.controller('SignupCtrl', function($scope, GlobalParameters, $http, $window, localStorageService){
	console.log('Signup Ctrl');
	var origin = myNavigator.getCurrentPage().options.origin;
	var selected_business = myNavigator.getCurrentPage().options.selected_business;

	$scope.signup = function(fullname, email, password, profile_url){
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
					if (profile_url=="")
						profile_url = "images/default_user.png";
					login_user['profile'] = profile_url;
					GlobalParameters.login_status = 1;
					GlobalParameters.setCurrentUser(login_user);
					localStorageService.set('login_user', login_user);
					//myNavigator.pushPage('pages/en/profile.html', {login_user: login_user});
					//myNavigator.resetToPage(origin, {animation: 'fade', login_user: login_user});

					if (selected_business == undefined)
						myNavigator.resetToPage(origin, {animation: 'fade', login_user: login_user});
					else
						myNavigator.resetToPage(origin, {animation: 'fade', login_user: login_user, selected_biz: selected_business});
				}
			}, function(error){
				alert('Failed: ' + error);
			});
	}

	$scope.SignUpWithFacebook = function(){
		console.log('singup');
		var client_id = '191042334383020'; //YOUR App ID or API Key
        var client_secret = '50a3083a12e0fd435f77ad06900dc371'; //// YOUR App Secret
        var redirect_uri = 'https://www.facebook.com/connect/login_success.html';  //// YOUR CALLBACK URL
        var display = 'touch';
        var authorize_url = "https://graph.facebook.com/v2.0/oauth/authorize?";
        authorize_url += "client_id=" + client_id;
        authorize_url += "&redirect_uri=" + redirect_uri;
        authorize_url += "&display=" + display;
        authorize_url += "&scope=public_profile,email";
        
        var ref = window.open(authorize_url, '_blank', 'location=yes');
        //var ref = window.open(authorize_url, '_blank', 'location=yes,clearsessioncache=yes,clearcache=yes');
        ref.addEventListener('loadstart', function(event)
        {
            var loc = event.url;
            //$scope.test = loc;

            if(loc.indexOf(redirect_uri + "?") >= 0)
            {
                ref.close();
                //$scope.data = "YES";
                var result = loc.split("#")[0];
                login_accessToken = result.split("&")[0].split("=")[1];
                
                var url = 'https://graph.facebook.com/v2.0/oauth/access_token?';
                    url += 'client_id=' + client_id;
                    url += '&client_secret=' + client_secret;
                    url += '&code=' + login_accessToken;
                    url += '&redirect_uri=' + redirect_uri;
        
                $http.post(url,null).success(function(data){
                    accessToken = data.split("&")[0].split("=")[1];
                    url = "https://graph.facebook.com/v2.0/me?fields=id,name,email,picture&access_token=" + accessToken;
                    $http.get(url).success(function(data){
                    	var profile_url = data['picture']['data']['url'];
                    	$scope.signup(data['name'], data['email'], 'facebook', profile_url);
                    });
                });
            }
        });
    }	

	alert = function(msg) {
	    ons.notification.alert({
	      message: msg
	    });
	}
	
	$scope.alert = function(msg) {
    	ons.notification.alert({message: msg, title: 'Vcess'});
	}
});


app.controller("LoginCtrl", function($scope, $http, GlobalParameters, localStorageService){
	console.log('LoginCtrl');
	var origin = myNavigator.getCurrentPage().options.origin;
	var selected_business = myNavigator.getCurrentPage().options.selected_business;
	//console.log(selected_business);

	$scope.login_facebook = function(){
		console.log('login');
		var client_id = '191042334383020'; //YOUR App ID or API Key
        var client_secret = '50a3083a12e0fd435f77ad06900dc371'; //// YOUR App Secret
        var redirect_uri = 'https://www.facebook.com/connect/login_success.html';  //// YOUR CALLBACK URL
        var display = 'touch';
        var authorize_url = "https://graph.facebook.com/v2.0/oauth/authorize?";
        authorize_url += "client_id=" + client_id;
        authorize_url += "&redirect_uri=" + redirect_uri;
        authorize_url += "&display=" + display;
        authorize_url += "&scope=public_profile,email";
        
        var ref = window.open(authorize_url, '_blank', 'location=yes');
        //var ref = window.open(authorize_url, '_blank', 'location=yes,clearsessioncache=yes,clearcache=yes');
        ref.addEventListener('loadstart', function(event)
        {
            var loc = event.url;
            if(loc.indexOf(redirect_uri + "?") >= 0)
            {
                ref.close();
                var result = loc.split("#")[0];
                login_accessToken = result.split("&")[0].split("=")[1];
                
                var url = 'https://graph.facebook.com/v2.0/oauth/access_token?';
                    url += 'client_id=' + client_id;
                    url += '&client_secret=' + client_secret;
                    url += '&code=' + login_accessToken;
                    url += '&redirect_uri=' + redirect_uri;
        
                $http.post(url,null).success(function(data){
                    accessToken = data.split("&")[0].split("=")[1];
                    url = "https://graph.facebook.com/v2.0/me?fields=id,name,email,picture&access_token=" + accessToken;
                    $http.get(url).success(function(data){
                    	var profile_url = data['picture']['data']['url'];
                    	$scope.login(data['email'], 'facebook', profile_url);
                    });
                });
            }
        });
    }

	$scope.SendEmail = function(email){
		alert("A password recovery email has been sent.");
		$scope.myNavigator.pushPage('pages/en/profile_index.html');
	}

	$scope.login = function(email, password, profile_url){
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
					if (profile_url=="")
						profile_url = "images/default_user.png";
					login_user['profile'] = profile_url;
					GlobalParameters.login_status = 1;
					GlobalParameters.setCurrentUser(login_user);
					localStorageService.set('login_user', login_user);
					//myNavigator.pushPage('pages/en/profile.html', {login_user: login_user});
					if (selected_business == undefined)
						myNavigator.resetToPage(origin, {animation: 'fade', login_user: login_user});
					else
						myNavigator.resetToPage(origin, {animation: 'fade', login_user: login_user, selected_biz: selected_business});
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
});


app.controller("SearchCtrl", function($scope, $timeout, $http, $q){
	console.log('SearchCtrl');
	
	$scope.clearInput=function(){
		$scope.myForm.location_text = "";
	};

	$scope.clearInputSearch=function(){
		$scope.search_text = "";
	};

	$scope.Clear = function(){
		$scope.search_result = 0;
		$scope.businesses = {};
		$scope.disabled = 1;
	}

	var current_location = [{
		addr: '', 
		coordinate: {}
	}];

	$scope.results = {};

	$scope.data_not_found = 0;

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

	$scope.CurrentLocation = function(){
    	$scope.Clear();
    	getCurrentLocation().then(function(result) {
    		$scope.myForm.location_text = result['addr'];
    		$scope.search($scope.search_text, $scope.myForm.location_text, $scope.things);
    		
    	}, function(error){
    		console.log(error);
    		$scope.load_complete = 1;
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
					$scope.myForm.location_text ="Input search location";
					
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
    	} else if (location == "Input search location") {
			alert("Please input location to search.");
    	} else {
	    	GetData(search_text, location, search_item_flag).then(function(result) {
	    		//$scope.countResult = Object.getOwnPropertyNames(result['data']).length
	    		$scope.countResult = result['data'].length;
	    		
	    		console.log($scope.countResult);
	    		if ($scope.countResult == 0){
	    			$scope.search_result = 1;
	    			$scope.data_not_found = 1;
	    			$scope.load_complete = 1;
	    		} else {
	    		
	    		
	    			$scope.businesses = result['data'];
		    		$scope.data_not_found = 0;
		    		
		    		$scope.search_result = 1;
		    		$scope.predicate = 'distance';
		    		$scope.reverse = false;
		    		$scope.disabled = 0;
		    		
		    		if (selected_keyword != undefined){
						$scope.load_complete = 1;
					}
	    		}
	    		
	    	});
    	}
    	
    	
    }

	OnLoad = function(){
		$scope.myForm = {};
		var page = myNavigator.getCurrentPage();
		var selected_keyword = page.options.keyword;

		$scope.businesses = {};
		getCurrentLocation().then(function(result) {
    		$scope.myForm.location_text = result['addr'];
    		if (selected_keyword != undefined){
				//console.log(selected_keyword);
				$scope.search_text = selected_keyword;
				$scope.search($scope.search_text, $scope.myForm.location_text, 1);

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

    $scope.SortBy =function(sort_item, reverse){
    	$scope.predicate = sort_item;
    	$scope.reverse = reverse;
    }

    function GetSearchCity(addr){
    	var search_city;

    	if (addr != current_location['addr']){
    		if (addr == "Olympic Stadium") {
    			current_location['coordinate'] = {lat: 11.55858, lng: 104.91183};
		        search_city = "Phnom Penh";
		    } else if (addr == "Independence Monument") {
		    	current_location['coordinate'] = {lat: 11.556359, lng: 104.928143};
		        search_city = "Phnom Penh";
		    } else if (addr == "Psar Thmey") {
		    	current_location['coordinate'] = {lat: 11.56966, lng: 104.92117};
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
				deferred.resolve(data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

});

app.controller('PhotoListCtrl', function($scope, $http, $timeout, $q){
	console.log('PhotoListCtrl');
	
	OnLoad = function(){

		GetData($scope.selected_city).then(function(result) {
			$scope.count_result = Object.getOwnPropertyNames(result['data']).length-1;
			console.log($scope.count_result);
			if ($scope.count_result == 0){
    			$scope.search_result = 1;
    			$scope.data_not_found = 1;
	    	} else {
				$scope.businesses = result['data'];
	    		$scope.search_result = 1;
	    		$scope.data_not_found = 0;
	    		$scope.ShowMore = 1;	
	    	}
	    });
	}

	$scope.SortBy =function(sort_item, reverse){
    	$scope.predicate = sort_item;
    	$scope.reverse = reverse;	
    }
   
	function GetData(selected_city){
		var deferred = $q.defer();

		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/search_kh.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: {get_photo_by_city_flag: 1, city: selected_city}
		}

		console.log(req);
			$http(req).then(function(data){
				deferred.resolve(data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	$scope.selected_city = myNavigator.getCurrentPage().options.city;
	$scope.businesses = {};
	OnLoad();

});

app.controller('CategoryListCtrl', function($scope, $http, $timeout, $q){
	console.log('CategoryListCtrl');
	var page = myNavigator.getCurrentPage();
	$scope.selected_category = page.options.selected_category;
	$scope.selected_category_key = page.options.selected_category_key;
	$scope.data_not_found = 0;
	var current_location = [{
		addr: '', 
		coordinate: {}
	}];
	
	$scope.clearInput=function(){
		$scope.location_text = "";
	};

	$scope.Clear = function(){
		console.log('clear');
		$scope.search_result = 0;
		$scope.businesses = [];
		$scope.disabled = 0;
	}

	alert = function(msg) {
	    ons.notification.alert({
	      message: msg,
	      title: 'Vcess'
	    });
	}

	$scope.CurrentLocation = function(){
    	$scope.Clear();
    	//$scope.location_text ="";
    	getCurrentLocation().then(function(result) {
    		$scope.location_text = result['addr'];
    		$scope.search($scope.selected_category_key, $scope.location_text);
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
					$scope.location_text ="Input search location";
					
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

    		$scope.location_text = result['addr'];

    		$scope.search($scope.selected_category_key, $scope.location_text);

    	}, function(error){
    		console.log(error);
    		$scope.load_complete = 1;
    	});
	}

	OnLoad();

	$scope.search = function(selected_category_key, location){
		console.log(location);
		$scope.businesses = {};

		if (location == "Input search location"){
			alert("Please input location to search.");
		} else {
			GetData(selected_category_key, location).then(function(result) {
	    		$scope.count_result = result['data'].length;
	    		all_biz = $scope.count_result;
	    		console.log($scope.count_result);
	    		if ($scope.count_result == 0){
	    			$scope.search_result = 1;
	    			$scope.data_not_found = 1;
		    	} else {
	    			$scope.businesses = result['data'];		    		
		    		$scope.data_not_found = 0;
		    		$scope.search_result = 1;
		    		$scope.predicate = 'distance';
		    		$scope.reverse = false;
		    		$scope.disabled = 0;
		    	}
		    	$scope.load_complete = 1;
	    		
	    	});
		}   	
    }

   
    $scope.SortBy =function(sort_item, reverse_flag){
    	$scope.predicate = sort_item;
    	$scope.reverse = reverse_flag;	
    }

    function GetSearchCity(addr){
    	var search_city;

    	if (addr != current_location['addr']){
    		if (addr == "Olympic Stadium") {
    			current_location['coordinate'] = {lat: 11.55858, lng: 104.91183};
		        search_city = "Phnom Penh";
		    } else if (addr == "Independence Monument") {
		    	current_location['coordinate'] = {lat: 11.556359, lng: 104.928143};
		        search_city = "Phnom Penh";
		    } else if (addr == "Psar Thmey") {
		    	current_location['coordinate'] = {lat: 11.56966, lng: 104.92117};
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
   
	function GetData(selected_category_key, location){
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
		 	data: { find_category_flag: 1, category: selected_category_key, city_en: search_city, lat: current_location['coordinate']['lat'], lng: current_location['coordinate']['lng']}
		}

		console.log(req);
			$http(req).then(function(data){
				console.log(data);
				deferred.resolve(data);
			}, function(error){
				deferred.reject('Error was: ' + error);
			});
		return deferred.promise;
	}

	

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}
});

// app.controller('AllCategoriesCtrl', function($scope, $http){
// 	console.log('AllCategoriesCtrl');

// 	var url = "http://www.vcess.com/ajax/get_data.php";
// 	GetAllCategories(); // Load all categories

// 	function GetAllCategories(){  
// 		console.log('GetAllCategories()');
// 	  	$http.post(url).success(function(data){
// 	  		$scope.categories = data;
// 	    });
// 	};
// });

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



app.controller('InboxCtrl', function($scope, GlobalParameters){
	console.log('InboxCtrl');
	$scope.login_status = GlobalParameters.login_status;
});



// app.controller('ItemSetsCtrl', function($scope, $q, $http){
// 	console.log('ItemSetsCtrl');
	
// 	function GetItemSet(categories){
// 		var deferred = $q.defer();
// 		var req = {
// 		 	method: 'POST',
// 		 	url: 'http://www.vcess.com/ajax/search.php',
// 		 	headers: {
// 		   		'Content-Type': 'application/json'
// 		 	},
// 		 	data: { categories: categories}
// 		}

// 		console.log(req);
// 		$http(req).then(function(data){
// 			//console.log(data['data'].length);
// 			deferred.resolve(data['data']);
// 		}, function(error){
// 			deferred.reject('Error was: ' + error);
// 		});
// 		return deferred.promise;
// 	}

// 	function LoadData(){
// 		var biz_categories = myNavigator.getCurrentPage().options.biz_category;
// 		var categories = biz_categories.split(', ');
// 	    GetItemSet(categories).then(function(result) {
// 	    	if (result.length == 0){
// 	    		$scope.data_not_found = 1;
// 	    	} else {
// 	    		$scope.data_not_found = 0;
// 	    		$scope.item_sets = result;	
// 	    	}
//     		$scope.load_complete = 1;
//     	}, function(error){
//     		console.log(error);
//     		$scope.features = {};
//     	});
// 	}

// 	LoadData();
// });

// app.controller('FeaturesCtrl', function($scope, $q, $http){
// 	console.log('FeaturesCtrl');
	
// 	function GetBizFeatures(biz_id){
// 		var deferred = $q.defer();
// 		var req = {
// 		 	method: 'POST',
// 		 	url: 'http://www.vcess.com/ajax/search.php',
// 		 	headers: {
// 		   		'Content-Type': 'application/json'
// 		 	},
// 		 	data: { biz_id: biz_id}
// 		}
// 		$http(req).then(function(data){
// 			// console.log('req');
// 			console.log(data['data']);
// 			deferred.resolve(data['data']);
// 		}, function(error){
// 			deferred.reject('Error was: ' + error);
// 		});
// 		return deferred.promise;
// 	}

// 	function LoadData(){
// 		var biz_id = myNavigator.getCurrentPage().options.biz_id;
// 		GetBizFeatures(biz_id).then(function(result) {
// 			console.log(result['business_id']);
//     		//$scope.features = result;
//     	}, function(error){
//     		console.log(error);
//     		$scope.features = {};
//     	});
// 	}

// 	LoadData();
// });


app.controller('BusinessHomeCtrl', function($scope, $timeout, $window, $q, $http, GlobalParameters, localStorageService){
	console.log('BusinessHomeCtrl');

	$scope.dialogs = {};

	$scope.show = function(dlg, current_photo) {
		$scope.selected_photo = current_photo;
		if (!$scope.dialogs[dlg]) {
		  	ons.createDialog(dlg, {parentScope: $scope}).then(function(dialog) {
		    	$scope.dialogs[dlg] = dialog;
		    	dialog.show();
		  	});
		} else {
		  	$scope.dialogs[dlg].show();
		}
	}

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
	var selected_business = page.options.selected_biz;
	console.log(selected_business);
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
		//console.log(GlobalParameters.login_status);
		if (GlobalParameters.login_status) {
			//console.log(current_user['favorite']);
			if (Find(current_user['favorite'], biz_id)){
				$scope.alert('You have already favorited this place.');
			} else {
				if (selected_business['favorite']==0)
					selected_business['favorite']="";
				
				var user_id = current_user['user_id'];
				var new_favorite = selected_business['favorite'] + "," + user_id;
				var param = "favorite";
				var value = new_favorite;
				var user_value = current_user['favorite'] + "," + biz_id;
				
				
				UpdateDB(param, value, user_value, biz_id, user_id).then(function(result) {
					//$scope.alert('Thanks for your feedback!');
					$scope.fav_color = {'color':'red'};
					$scope.business['favorite'] = current_fav + 1;
					current_user['favorite'] = user_value;
					GlobalParameters.setCurrentUser(current_user);
					localStorageService.set('login_user', current_user);
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
				if (selected_business['wish_list']==0)
					selected_business['wish_list']="";
				
				var user_id = current_user['user_id'];
				var new_wish_list = selected_business['wish_list'] + "," + user_id;
				var param = "wish_list";
				var value = new_wish_list;
				var user_value = current_user['wish_list'] + "," + biz_id;
				
				
				UpdateDB(param, value, user_value, biz_id, user_id).then(function(result) {
					//$scope.alert('Thanks for your feedback!');
					$scope.wish_color = {'color':'red'};
					$scope.business['wish_list'] = current_wish_list + 1;
					current_user['wish_list'] = user_value;
					GlobalParameters.setCurrentUser(current_user);
					localStorageService.set('login_user', current_user);

		    	}, function(error){
		    		console.log(error);

		    	});	
			}
			
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.ShowRateSection = function(){
		if (GlobalParameters.login_status) {
			$scope.ShowRate = !$scope.ShowRate;
			if ($scope.ShowReview)
				$scope.ShowReview = !$scope.ShowReview;
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.ShowReviewSection = function(){
		if (GlobalParameters.login_status) {
			$scope.ShowReview = !$scope.ShowReview;
			if ($scope.ShowRate)
				$scope.ShowRate = !$scope.ShowRate;
		} else {
			$scope.confirm('Login required. Would you like to login now?');
		}
	}

	$scope.Rate = function(biz_id, rate_star){
		console.log('Rate');
		// if (GlobalParameters.login_status) {
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
				localStorageService.set('login_user', current_user);

	    	}, function(error){
	    		console.log(error);

	    	});	
	}

	$scope.Review = function(biz_id, review){
		console.log('Review');
		// if (GlobalParameters.login_status) {
			
			var user_id = current_user['user_id'];
		
			UpdateDBReview(review, biz_id, user_id).then(function(result) {

				$scope.alert('Thanks for your feedback!');
				$scope.review_color = {'color':'red'};
				$scope.ShowReview = 0;
	    	}, function(error){
	    		console.log(error);

	    	});	
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
				console.log(result.length);
				for (i = 0; i < num_photos; i++) {
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

	function GetReview(biz_id){
		$scope.all_reviews = 0;
		//var deferred = $q.defer();

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
				// console.log('req');
				// console.log(data);
				$scope.all_reviews = data['data'];
				//deferred.resolve(all_data);
			}, function(error){
				console.log('Error was: ' + error);
			});
		//return deferred.promise;
	
	}	

	function LoadData(){
		$scope.business = selected_business;
		UpdateViewCount();
		GetReview(selected_business['id']);
        
		if ($scope.business['rate'] % 1 == 0)
        	$scope.show_half_star = 0;
        else
        	$scope.show_half_star = 1;

        console.log(selected_business['favorite']);
        
        console.log(typeof selected_business['favorite']);

        if (selected_business['favorite'] == "")
	        selected_business['favorite_num'] = 0;
	    else 
	    	$scope.business['favorite_num'] = selected_business['favorite'].split(',').length-1;
	    
	    if (selected_business['wish_list'] == "")
	        selected_business['wish_list_num'] = 0;
	    else
	    	$scope.business['wish_list_num'] = selected_business['wish_list'].split(',').length-1;


	    if ($scope.business['owner'] == "")
	        $scope.business['owner'] = "N/A";

	    var coordinate = selected_business['coordinate'].split(',');
	    ShowMap(coordinate[0], coordinate[1]);
	    //console.log(selected_business);
	    
	    GetPhotos(selected_business['id'], selected_business['photos']);

	    if (GlobalParameters.login_status) {
	    	if (Find(current_user['favorite'], selected_business['id'])){
		    	$scope.fav_color = {'color':'red'};
		    }

		    if (Find(current_user['wish_list'], selected_business['id'])){
		    	$scope.wish_color = {'color':'red'};	
		    }	
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
	            	break;
	          	case 1:
	            	$scope.myNavigator.pushPage('pages/en/authentication.html', {origin: 'pages/en/business_home.html', selected_business: selected_business});
	            break;
	        }
	      }
	    });
	}	
    
});

// app.controller('NewBusinessCtrl', function($scope){
// 	console.log('NewBusinessCtrl');
// 	$scope.myDate = new Date();

// 	$scope.show_country_list = 0;
// 	$scope.current_country = "Japan";
// 	$scope.country = "Cambodia";

// 	$scope.SelectCountry = function(selected_country){
// 		$scope.show_country_list = 0;
// 		$scope.country = $scope.current_country;
// 		$scope.current_country = selected_country;
// 	}
// });


// app.controller('ItemsCtrl', function($scope){
// 	var X = XLSX;

// 	$scope.process_wb = function(wb) {
// 		//var output = "";
		
// 		//output = JSON.stringify($scope.to_json(wb), 2, 2);
// 		//output = $scope.to_json(wb);
// 		//output = $scope.to_csv(wb);		

// 		// if(out.innerText === undefined) out.textContent = output.Sheet1[1].Goods;
// 		// else out.innerText = output.Sheet1[1].Goods;
// 		return output;
// 	}

// 	$scope.filter_data = function(sheet_name, filter_column, data){

// 		var result = "";
// 		angular.forEach(data[sheet_name], function(value, key) {
// 			//alert(JSON.stringify(value[filter_column]));
// 			result = result + JSON.stringify(value[filter_column]) + "\n";
// 		});

// 		out.innerText = result;
// 	}

// 	$scope.to_csv = function(workbook) {
// 		var result = [];
// 		workbook.SheetNames.forEach(function(sheetName) {
// 			var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
// 			if(csv.length > 0){
// 				result.push("SHEET: " + sheetName);
// 				result.push("");
// 				result.push(csv);
// 			}
// 		});
// 		return result.join("\n");
// 	}

// 	$scope.to_json = function(workbook) {
// 		var result = {};
// 		workbook.SheetNames.forEach(function(sheetName) {
// 			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
// 			if(roa.length > 0){
// 				result[sheetName] = roa;
// 			}
// 		});
// 		return result;
// 	}

// 	$scope.fileNameChanged = function(e) {
// 		var output = [];
// 	   	var files = e.files;
// 	  	var f = files[0];
// 	   	var reader = new FileReader();
// 	   	var name = f.name;
// 	   	{
// 		   	reader.onload = function(e){
// 			   	var wb;
// 			   	var data = e.target.result;
// 			   	wb = X.read(data, {type: 'binary'});
// 			   	output = $scope.to_json(wb);
// 			   	$scope.filter_data($scope.SheetName, $scope.ColumnName, output);
// 		   	};	
// 		   	reader.readAsBinaryString(f);
// 	   	}
	   	
	   	
// 	}
// });


app.controller('ProfileCtrl', function($scope, GlobalParameters, localStorageService){
	console.log('Profile Ctrl');

	$scope.login_status = GlobalParameters.login_status;
	$scope.login_user = GlobalParameters.current_user;

	$scope.Logout = function(){
		ons.notification.confirm({
	      	message: "Are you sure you want to log out of Vcess?",
	      	title: 'Vcess',
	      	buttonLabels: ["Yes", "No"],
	      	callback: function(idx) {
	        switch (idx) {
	          	case 0:
	            	GlobalParameters.login_status = 0;
					$scope.myNavigator.resetToPage('pages/en/home.html');
					localStorageService.remove('login_user');
	          	case 1:
	            	break;
	            break;
	        }
	      }
	    });
	}
});


app.controller('FriendListCtrl', function($scope, GlobalParameters){

});

app.controller('IndexCtrl', function($scope, GlobalParameters, localStorageService, $http){
	//GlobalParameters.SetIsOwner(0);
	var login_user = localStorageService.get('login_user');
	if (login_user != null){
		var profile_url = login_user['profile'];
		var user_id = login_user['user_id'];
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/authenticate.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { update_login_flag: 1, user_id: user_id }
		}

		console.log(req);
			$http(req).then(function(data){
				console.log(data);
				if (data['data'].length == 0){
					alert('Incorrect email or password. Please try again.');
				} else {
					login_user = data['data'];
					login_user['profile'] = profile_url;
					GlobalParameters.login_status = 1;
					GlobalParameters.setCurrentUser(login_user);
					localStorageService.set('login_user', login_user);
				}
			}, function(error){
				alert('Failed: ' + error);
			});
	}

	update_user_login = function(user_id){
		//console.log('Login');
		var req = {
		 	method: 'POST',
		 	url: 'http://www.vcess.com/ajax/authenticate.php',
		 	headers: {
		   		'Content-Type': 'application/json'
		 	},
		 	data: { update_login_flag: 1, user_id: user_id }
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
					//console.log('local');
					//console.log(localStorageService.get('login_user'));
					$scope.myNavigator.pushPage('pages/en/profile_index.html', {login_user: login_user});
				}
			}, function(error){
				alert('Failed: ' + error);
			});
	}
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

// app.controller('SettingsCtrl', function($scope, GlobalParameters){
// 	$scope.SetShopListHome = function(){
// 		GlobalParameters.SetHomePage(0,1,0);
// 	};
// 	$scope.SetShopHome = function(){
// 		GlobalParameters.SetHomePage(0,0,1);
// 	};
// 	$scope.SetSearchHome = function(){
// 		GlobalParameters.SetHomePage(1,0,0);
// 	};
// });


app.controller('FavCtrl', function($scope, GlobalParameters, $q, $http){
	console.log('FavCtrl');
	$scope.businesses = {};

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	$scope.login_status = GlobalParameters.login_status;
	var current_user = GlobalParameters.current_user;

	$scope.FavList = function(){
		$scope.businesses = {};
		var fav_list = current_user['favorite'];
		if (fav_list == ""){
			$scope.EmptyList = 1;
			$scope.EmptyListText = "You haven't favorited any places yet.";
		} else {
			GetData(fav_list).then(function(result) {
				$scope.businesses = result;
				$scope.LoadComplete = 1;
			});
		}
	}

	$scope.WishList = function(){
		$scope.businesses = {};
		var wish_list = current_user['wish_list'];
		if (wish_list == ""){
			$scope.EmptyList = 1;
			$scope.EmptyListText = "You haven't added any places to your wish list yet.";
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
			$scope.businesses = {};
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
		$scope.businesses = {};
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
	//var biz_id = page.options.biz_id;
	$scope.reviews = page.options.reviews;
	
	// function GetData(){
	// 	var deferred = $q.defer();

	// 	var req = {
	// 	 	method: 'POST',
	// 	 	url: 'http://www.vcess.com/ajax/search_kh.php',
	// 	 	headers: {
	// 	   		'Content-Type': 'application/json'
	// 	 	},
	// 	 	data: {get_review_flag: 1, biz_id: biz_id}
	// 	}

	// 	console.log(req);
	// 		$http(req).then(function(data){
	// 			console.log('req');
	// 			console.log(data);
	// 			var all_data = data['data'];
	// 			deferred.resolve(all_data);
	// 		}, function(error){
	// 			deferred.reject('Error was: ' + error);
	// 		});
	// 	return deferred.promise;
	// }

	$scope.getRate = function(num) {
		num = parseInt(num);
		return new Array(num);   
	}

	// function OnLoad(){
	// 	GetData().then(function(result) {
	// 		$scope.reviews = result;
	// 	});
	// }

	// OnLoad();
});