/**
 * Iciniga api description:
 * http://docs.icinga.org/icinga2/latest/doc/module/icinga2/chapter/icinga2-api
 */

"use strict";
var dashboard = angular.module("dashboard", ['ui.bootstrap', 'video-background']);

dashboard.factory("globals", function($window, $http) {
	var dev = true;
	
	var factory = {
		hosts: {
			// filter for error services: ?filter=service.state!=0
			location: 'https://icticingalp01.ms.uhbs.ch:5665/v1/objects/hosts',
			data: [],
			error: null,
			response: null
		},
		services: {
			location: 'https://icticingalp01.ms.uhbs.ch:5665/v1/objects/services',
			data: [],
			error: null,
			response: null
		}
	};
	
	// dev env uses a script (fetch.sh) to get json from server
	if (dev) {
		factory.hosts.location = "hosts.json"
		factory.services.location = "services.json"
	}
	
	function success_callback_services(response) {
		factory.services.response = response;
		factory.services.error = false;
		factory.services.data = response.data;
		console.log(response.data)
	}

	function error_callback_services(response) {
		factory.services.response = response;
		factory.services.data = {results:[]};
		factory.services.error = true;
		console.log("error in node.fetch, result: " + response.statusText)
	}

	function success_callback_hosts(response) {
		factory.hosts.response = response;
		factory.hosts.error = false;
		factory.hosts.data = response.data;
		console.log(response.data)
	}

	function error_callback_hosts(response) {
		factory.hosts.response = response;
		factory.hosts.data = {results:[]};
		factory.hosts.error = true;
		console.log("error in node.fetch, result: " + response.statusText)
	}

	factory.fetch = function() {
		$http.get(factory.services.location)
			.then(success_callback_services, error_callback_services);
		$http.get(factory.hosts.location)
			.then(success_callback_hosts, error_callback_hosts);
	};

	return factory;
});

function _appController($scope, $window, globals, $timeout) {
	$scope.services = {results:[]};
	$scope.services_len = 0;
	$scope.hosts = {results:[]};
	$scope.hosts_len = 0;
	$scope.services_critical = 0;
	$scope.services_warning = 0;
	$scope.player = null;

	var e;
	$scope.$watch(function(){
		return globals.services.data;
	}, function(newValue, oldValue){
		$scope.services = globals.services.data;
		$scope.services_critical = 0;
		$scope.services_warning = 0;
		if (globals.services.data.results && globals.services.data.results.length) {
			$scope.services_len = globals.services.data.results.length;
			for (e in globals.services.data.results) {
				if (globals.services.data.results[e].attrs.last_hard_state == 2) {
					$scope.services_critical++;
				}
				if (globals.services.data.results[e].attrs.last_hard_state == 1)
					$scope.services_warning++;
			}
		} else {
			$scope.services_len = 0;
		}
		
		/*
		if ($scope.services_critical)
			document.getElementById("bgvideo").parentNode.style.display = 'block';
		else
			document.getElementById("bgvideo").parentNode.style.display = 'hidden';
		*/
	});	
	
	$scope.$watch(function(){
		return globals.hosts.data;
	}, function(newValue, oldValue){
		$scope.hosts = globals.hosts.data;
		if (globals.hosts.data.results && globals.hosts.data.results.length) {
			$scope.hosts_len = globals.hosts.data.results.length;
		} else {
			$scope.hosts_len = 0;
		}
	});	
	
	$scope.init = function(u){
		console.log("Init ...");
		globals.fetch();
	}
	
	$scope.serviceErrrorCriticalFilter = function (item) { 
		return item.attrs.last_hard_state == 2;
	};
	
	$scope.serviceErrrorWarningFilter = function (item) { 
		return item.attrs.last_hard_state == 1;
	};
	
	// refresh data periodically
	function reload() {
		$timeout(function() {
		  globals.fetch();
		  reload();
		}, 10000);
	}

	// reload page periodicalle to preven the browser eating all memmory
	$timeout(function() {
	  window.location.reload();
	}, 60*60*1000); // every hour
	
	$scope.now = function() {
		var offset = new Date().getTimezoneOffset()*60-3600;
		offset = 0;
		//console.log(new Date().dst())
		return (Math.floor(new Date().getTime() / 1000) + offset);
	}
	
	$scope.hhmm = function (secs) {
		var sec_num = parseInt(secs, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		return hours+':'+minutes; // +':'+seconds;
	}
	
	$scope.bgvideo = {
		mp4: "/fireplace.mp4"
	}
	
	reload();

}

dashboard.controller("appController", ['$scope', '$window', 'globals', '$timeout', _appController]);



