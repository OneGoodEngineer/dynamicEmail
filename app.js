var app = angular.module('dynamicEmail',[]);

app.controller('composeEmail', function($scope){
  $scope.subject = "Hello World";
});