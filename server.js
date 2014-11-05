var express = require('express');
var https = require('https');

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
  https.get('https://dynamicemail.firebaseio.com/'+imageID+'/img.json', function(firebaseRes) {
    var firebaseDataURL = '';
    firebaseRes.on('data', function(chunk) {
      firebaseDataURL += chunk;
    });
    firebaseRes.on('end', function(){
      console.log('firebaseDataURL', firebaseDataURL);
      // Strip leading and trailing double quotes
      firebaseDataURL = firebaseDataURL.slice(1, firebaseDataURL.length-1);
      // decode dataURL as image
      var image = decodeBase64Image(firebaseDataURL).data;
      console.log('image', image);
      // respond with image
      res.status(200);
      res.set('Content-Type', 'image/png');
      res.end(image, 'binary');
    })
  }).on('error', function(e) {
    console.error(e);
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
