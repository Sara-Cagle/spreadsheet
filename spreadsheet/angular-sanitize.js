var spreadsheetApp = angular.module('spreadsheetApp',['ngResource']);
spreadsheetApp.config(function($routeProvider) {
	$routeProvider.
		when('/', {
			controller: 'controllers/SpreadSheetController.js',
			template: 'views/innerHTML.html'
	});
}
