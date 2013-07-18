'use strict';

var spreadsheetApp = angular.module('spreadsheetApp',[]);

spreadsheetApp.config(function($routeProvider) {
	$routeProvider.
		when('/', {
			controller: 'spreadsheetController',
			templateUrl: 'views/innerHTML.html'
	});
});
