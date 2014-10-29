var app = angular.module('dynamicEmail',[]);

app.controller('composeEmail', function($scope, http){
  $scope.submitEmail = function(emailBody){ 
    console.log('getting image', emailBody);
    http.createImage(emailBody).then(function(response){
      console.log('response',response.data);
    }); 
  };
});

app.factory('http', function($http){
  var getImage = function(imageID){
    return $http({
      url: '/api/images/'+imageID,
      method: 'GET'
    }).success(function(response){
      return response;
    });
  };

  var createImage = function(emailBody){
    var textCanvas = document.getElementById('textCanvas').getContext('2d')
    textCanvas.canvas.width = textCanvas.measureText(emailBody).width;
    textCanvas.fillText(emailBody, 0, 10);
    var dataUrl = textCanvas.canvas.toDataURL();
    return $http.post('/api/create/'+Math.floor(Math.random()*100000000),
      {'emailBody': dataUrl}
    ).success(function(response){
      return response;
    });
  };

  return {
    getImage: getImage,
    createImage: createImage
  }
});