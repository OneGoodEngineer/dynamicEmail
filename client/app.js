var app = angular.module('dynamicEmail',['firebase']);

app.controller('composeEmail', function($scope, http){
  $scope.submitEmail = function(emailBody){ 
    http.createImage(emailBody).then(function(imageID){
      console.log('newly-created imageID:',imageID);
      $scope.imageID = imageID;
    });
  };
  $scope.getImage = function(imageID){
    http.getImage(imageID).then(function(imageObj){ 
      $scope.returnedImage = imageObj.img;
      console.log($scope.returnedImage); 
    });
  };
});

app.value('firebaseURL', 'https://dynamicemail.firebaseio.com/');

app.factory('http', function($http, $firebase, firebaseURL){
  var ref = new Firebase(firebaseURL);
  var sync = $firebase(ref);

  var getImage = function(imageID){
    var list = $firebase(ref).$asArray();
    return list.$loaded(function(loadedList){ return loadedList.$getRecord(imageID); });
  };

  var createImage = function(emailBody){
    var textCanvas = document.getElementById('textCanvas').getContext('2d')
    textCanvas.canvas.width = textCanvas.measureText(emailBody).width;
    textCanvas.fillText(emailBody, 0, 10);
    var dataUrl = textCanvas.canvas.toDataURL();
    return sync.$push({img: dataUrl}).then(function(newChildRef) {
      console.log("added record with id " + newChildRef.name());
      return newChildRef.name();
    });
  };

  return {
    getImage: getImage,
    createImage: createImage
  }
});