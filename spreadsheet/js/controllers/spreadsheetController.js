'use strict';

spreadsheetApp.controller('spreadsheetController',
	function spreadsheetController($scope, $rootScope){
        
        $rootScope.$watch('csvPatientData', function() {
            if ($rootScope.csvPatientData) {
                console.log($rootScope.csvPatientData);
                console.log("Inside the rootScope watch function");
                $scope.csv = $rootScope.csvPatientData;
                $scope.parseCsvData();
            }
        });
        
        $scope.$watch('csv', function() {
            
        });
        
        $scope.createPatientObject = function(subject_id, dx, race, alleles) {
            return( {
                subject_id: subject_id,
                race: race,
                dx: dx,
                alleles: alleles		
            });
        };
        
        
        $scope.updateText = function() {}; // update text from spreadsheet
        $scope.patientObjects = [];
        
        $scope.parsePatients = function() {
            for(var i = 0; i<$scope.clearPatients.length; i++){
                var alleleArray=[];
                for(var j = 3; j<$scope.clearPatients[i].length; j++){
                    alleleArray.push($scope.clearPatients[i][j]);
                };
                var obj = $scope.createPatientObject(
                                            $scope.clearPatients[i][0],
                                            $scope.clearPatients[i][1],
                                            $scope.clearPatients[i][2],
                                            alleleArray);
                $scope.patientObjects.push(obj);
            }
            //var patient = {$scope.createPatientObject(id, race, dx, alleles)};
            //$scope.patientObjects.push(patient);
            // Create patient object from data
            // Append patient object to $scope.patientObjects
            // 
        }; // convert patients into JSON objects
        
        $scope.parseCsvData = function() {
            var allTextLines = $scope.csv.split(/\r?\n/);
         
            var breakText = []; //DOUBLE ARRAY
            //allTextLines is an array with each line as an index
            //breakText is an array of arrays, one per line, including the header
            //so that each word is an index of a double for loop
            for(i=0; i<allTextLines.length; i++){
                breakText.push(allTextLines[i].split(','));
            };
            
            //creation of an array of headers only. 1d Array, each index is a title
            var headers = breakText[0];
            var headerLength= headers.length;
            
            
            var indexArray = []; 
            var regex = (/(Subject_ID|Dx|Race|^A$|^B$|^C$|DMA|DMB|DOA|DOB|DPA1|DPB1|DPA|DPB|DQA|DQB|DQA1|DQB1|DRA|DRB1|DRB3|DRB4|DRB5|^E$|^F$|^G$|^H$|^J$|^K$|^L$^V$)/);
            //creation of the indexArray. It holds the indexes of values to delete	
            for(var i = 0; i<headerLength; i++){
                if (!regex.test(headers[i])){
                    indexArray.push(i);
                };
            };

            
            //iterates through breakText and deletes all 
            //instances noted in the indexAray 
            for(var i=0; i<breakText.length; i++){
                for(var k=0; k<indexArray.length; k++){
                    var unwantedIndex = indexArray[k];
                    delete breakText[i][unwantedIndex];
                };
            };
            
            //reassigning headers to the new breakText deleted unwanted values
            headers = breakText[0];
            
            
            //used in the filter to see if the element is undefined
            function isDefined(element, index, array){
                return (element !== undefined || element !=='\n' || element !=='\r\n');
            };
            
            //new header file including ONLY desired titles; no undefines
            $scope.clearHeaders = headers.filter(isDefined);
            //clearPatients is same style as breakText, 2D array, but only contains
            //patient data that is defined.
            $scope.clearPatients = [];
            for(var i=1; i<breakText.length; i++){
                if (breakText) {
                    $scope.clearPatients.push(breakText[i].filter(isDefined));
                }
            };
            
            //debug
            console.log("Here are the new headers: \n"+$scope.clearHeaders);
            console.log("And the new patient data: \n"+$scope.clearPatients);
            
            
            function createPatientObject(subject_id, race, dx, loci) {
                return {
                    subject_id: subject_id,
                    race: race,
                        dx: dx,
                        loci: loci		
                };
            };
            
            
            var blue_allele_regex = (/([A-Z0-9]+\*\d+:\d+:\d+)(.+)/);///(\*\d\d:\d\d:\d\d)/;
            var red_allele_regex = /(\*\d\d$)/;
            
            var red = [];
            var makeRed = function(){
                for(var i = 0; i<$scope.clearPatients.length; i++){
                    for(var j=0; j<$scope.clearPatients[i].length; j++){
                        if(red_allele_regex.test($scope.clearPatients[i][j])){
                            red.push($scope.clearPatients[i][j]);
                        };
                    };
                };
            };
            
            var blue = [];
            var makeBlue = function(){
                for(var i = 0; i<$scope.clearPatients.length; i++){
                    for(var j=0; j<$scope.clearPatients[i].length; j++){
                        if(blue_allele_regex.test($scope.clearPatients[i][j])){
                            //creates a match group that contains the
                            // length of the matching terms
                            var matches = $scope.clearPatients[i][j].match(/(\*.*)$/);
                            if(matches){
                                var len = matches[1].length;
                                //finding the end point to cut to
                                var sliceLen = (len-6)*-1;
                                //cutting backwards to eliminate x 
                                //number of extra terms
                                var sliceLoci = $scope.clearPatients[i][j].slice(0,sliceLen);
                                $scope.clearPatients[i][j] = sliceLoci;
                            };
                            //everything in the blue array has been pre-cut
                            blue.push($scope.clearPatients[i][j]);
                        };
                    };
                };
            };
            
            
            makeBlue();
            makeRed();
            
            $scope.makeColors = function(data){
                if(red.indexOf(data)>=0){
                    return "red";
                }
                else if(blue.indexOf(data)>=0){
                    return "blue";
                }
                else{
                    return "green";
                };
            };
            console.log("Finshed parsing document");
        };

        $scope.$watch('clearPatients',function(){
            if ($scope.clearPatients) {
                $scope.columns = $scope.clearHeaders;
                $scope.cells = {};
                $scope.values = $scope.clearPatients.map(function(c,row){
                    return c.map(function(data){
                            return {
                                content: data,
                                color: $scope.makeColors(data)
                            };
                    });
                });
                $scope.parsePatients();
                for(var i = 0; i<$scope.patientObjects.length; i++){console.log($scope.patientObjects[i])};
            }
        });
	}
);


/*var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readystate === 4 && xmlhttp.status === 200){
        var response = xmlhttp.responseText;
    }
    else if( xmlhttp.status === 400){
        console.log("Some type of 400 error, sorry.");
    };
};

xmlhttp.open("GET", "#", true);

xmlhttp.send();*/
