var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname)); // serve static client
app.get('/', function(req,res){ // get to static client
  res.redirect('/client/');
});

app.post('/api/create/:imgid', function(req, res){
  var pathToImage = path.join(__dirname, '/images/', req.params.imgid);
  console.log('image created at',pathToImage);
  var data = req.body.emailBody;

  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
  }

//3913092

  var imageBuffer = decodeBase64Image(data);
  fs.writeFile(pathToImage + '.jpg', imageBuffer.data, function(){
    res.end(imageBuffer.data);
  });
});

// change to app.put
app.post('/api/update/:imgid', function(req, res){
});

// change to app.delete
app.post('/api/delete/:imgid', function(req, res){
});

app.get('/api/images/:imgid', function(req, res){
  var pathToImage = path.join(__dirname, '/images/', req.params.imgid + '.jpg');
  console.log('image request for',pathToImage);
  res.sendFile(pathToImage);  
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('Listening on port',port);
});