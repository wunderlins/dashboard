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
		factory.services.data = [];
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
		factory.hosts.data = [];
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
	$scope.node = null;
	
	$scope.init = function(u){
		console.log("Init ...");
		globals.fetch();
	}
}

dashboard.controller("appController", ['$scope', '$window', 'globals', _appController]);

