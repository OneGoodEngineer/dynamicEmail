var app = angular.module('dynamicEmail',['firebase']);

app.controller('composeEmail', function($scope, http){
  $scope.createMessage = function(emailBody, fontPx){ 
    http.createImage(emailBody, fontPx).then(function(imageID){
      console.log('newly-created imageID:',imageID);
      $scope.messageID = imageID;
    });
  };
  $scope.destroyMessage = function(messageID){
    $scope.destroyMessageStatus = "destroying message...";
    http.destroyMessage(messageID).then(function(){
      $scope.destroyMessageStatus = "message destroyed.";
      $scope.messageID = '';
      $scope.body = '';
    });
  };
});

app.value('firebaseURL', 'https://dynamicemail.firebaseio.com/');

app.factory('http', function($http, $firebase, firebaseURL){
  var ref = new Firebase(firebaseURL);
  var sync = $firebase(ref);

  var destroyMessage = function(messageID){
    console.log('destroying messageID', messageID);
    var list = $firebase(ref).$asArray();
    return list.$loaded(function(loadedList){ 
      console.log('firebase loaded, deleting messageID', messageID);
      return loadedList.$remove(loadedList.$getRecord(messageID)); 
    });
  };

  var createImage = function(emailBody, fontPx){
    var canvas = document.getElementById('textCanvas');
    canvas.setAttribute("height", fontPx);
    var canvasContext = canvas.getContext('2d');
    canvasContext.canvas.width = fontPx*(canvasContext.measureText(emailBody).width)+1;
    canvasContext.font = fontPx+"px Arial"
    canvasContext.fillText(emailBody, 0, 0.75*fontPx);

    // canvasContext.scale(2,2);
    var dataUrl = canvasContext.canvas.toDataURL();
    return sync.$push({message: emailBody, img: dataUrl}).then(function(newChildRef) {
      console.log("added record with id " + newChildRef.name());
      return newChildRef.name();
    });
  };

  return {
    destroyMessage: destroyMessage,
    createImage: createImage
  }
});