var express = require('express');
var http = require('http');

var app = express();

app.use(express.static(__dirname)); // serve static client
app.get('/', function(req,res){ // get to static client
  res.redirect('/client/');
});

app.get('/api/:imageID/message.png', function(req, res){
  // extract imageID from request
  var imageID = req.params.imageID;
  console.log('imageID',imageID);
  // get dataURL string from firebase
  var options = {
    host: 'https://dynamicemail.firebaseio.com',
    path: '/'+imageID+'/img.json',
    method: 'GET',
    headers: {
      accept: '*/*'
    }
  };

  var req = http.request(options, function(firebaseRes){
    var firebaseData = '';
    firebaseRes.on('data', function (chunk) {
      firebaseData += chunk;
    });
    firebaseRes.on('end', function () {
      console.log('firebaseData',firebaseData);
      // decode dataURL as image
      var image = decodeBase64Image(firebaseRes);
      console.log('image',image);
      // respond with image
      res.writeHead('200', {'Content-Type': 'image/png'});
      res.end(image, 'binary');
    });
  });
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('Listening on port',port);
});

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  return response;
};
