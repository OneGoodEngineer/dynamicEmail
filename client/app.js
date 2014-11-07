var app = angular.module('dynamicEmail',['firebase']);

app.controller('composeEmail', function($scope, http){
  $scope.submitEmail = function(emailBody, fontPx){ 
    http.createImage(emailBody, fontPx).then(function(imageID){
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

  var createImage = function(emailBody, fontPx){
    var canvas = document.getElementById('textCanvas');
    canvas.setAttribute("height", fontPx);
    var canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = fontPx*(canvasContext.measureText(emailBody).width)+1;
    canvasContext.font = fontPx+"px Arial"
    canvasContext.fillText(emailBody, -15, fontPx-15);

    // canvasContext.scale(2,2);
    var dataUrl = canvasContext.canvas.toDataURL();
    return sync.$push({message: emailBody, img: dataUrl}).then(function(newChildRef) {
      console.log("added record with id " + newChildRef.name());
      return newChildRef.name();
    });
  };

  return {
    getImage: getImage,
    createImage: createImage
  }
});