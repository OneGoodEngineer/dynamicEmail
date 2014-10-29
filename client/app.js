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
    return $http({
      url: '/api/create/'+Math.floor(Math.random()*100000000),
      method: 'POST',
      dataType: 'application/json',
      data: {emailBody: emailBody}
    }).success(function(response){
      return response;
    });
  };

  var createImage2 = function(emailBody){
    return $http.post('/api/create/'+Math.floor(Math.random()*100000000),
      {'emailBody': emailBody}
    ).success(function(response){
      return response;
    });
  };

  return {
    getImage: getImage,
    createImage: createImage2
  }
});