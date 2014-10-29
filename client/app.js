var app = angular.module('dynamicEmail',[]);

app.controller('composeEmail', function($scope){
  $scope.submitEmail = function(body){ 
    alert(body); 
  };
});