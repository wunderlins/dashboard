/**
 * Iciniga api description:
 * http://docs.icinga.org/icinga2/latest/doc/module/icinga2/chapter/icinga2-api
 */

"use strict";
var dashboard = angular.module("dashboard", []);

dashboard.factory("globals", function($window, $http) {
	var factory = {
		hosts: {
			location: 'hosts.json',
			data: [],
			error: null,
			response: null
		},
		services: {
			location: 'services.json',
			data: [],
			error: null,
			response: null
		}
	};

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

function _appController($scope, $window, globals) {
	$scope.services = {results:[]};
	$scope.services_len = 0;
	$scope.hosts = {results:[]};
	$scope.hosts_len = 0;

	$scope.$watch(function(){
		return globals.services.data;
	}, function(newValue, oldValue){
		$scope.services = globals.services.data;
		if (globals.services.data.results && globals.services.data.results.length)
			$scope.services_len = globals.services.data.results.length;
		else 
			$scope.services_len = 0;
	});	
	
	$scope.$watch(function(){
		return globals.hosts.data;
	}, function(newValue, oldValue){
		$scope.hosts = globals.hosts.data;
		if (globals.hosts.data.results && globals.hosts.data.results.length)
			$scope.hosts_len = globals.hosts.data.results.length;
		else 
			$scope.hosts_len = 0;
	});	
	
	$scope.init = function(u){
		console.log("Init ...");
		globals.fetch();
	}
	
	$scope.serviceErrrorFilter = function (item) { 
		return item.attrs.last_state > 0; 
	};
}

dashboard.controller("appController", ['$scope', '$window', 'globals', _appController]);
