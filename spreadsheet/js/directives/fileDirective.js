angular.module('spreadsheetApp').directive('fileReader', function($rootScope) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl:'views/fileReaderTemplate.html',
        link: function (scope, element, attributes, controller) {
            element.bind("change", function(event) {
                var files = event.target.files;
                var reader = new FileReader();
                reader.onload = function() {
                    $rootScope.csvPatientData = this.result;
                    $rootScope.$digest();
                    console.log("Digested");
                };                
                reader.readAsText(files[0]);
            });
        } 
    }    
});


angular.module('spreadsheetApp').directive('spreadsheet', function() {
    return {
        restrict: 'E',
        require: 'file-reader',
        scope: true,
        templateUrl: 'views/spreadsheetTemplate.html',
        controller: 'spreadsheetController'
    };
});
