var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.static(__dirname)); // serve static client
app.get('/', function(req,res){ // get to static client
  res.redirect('/client/');
});

app.post('/api/create/:imgid', function(req, res){
  var pathToImage = path.join(__dirname, '/images/', req.params.imgid);
  console.log('image created at',pathToImage);
  var messageToWrite = req.body.emailBody;
  console.log('emailBody', messageToWrite);
  fs.writeFile(pathToImage, messageToWrite, function(){
    res.end('<img src=' + pathToImage + '>');
  });
});

// change to app.put
app.post('/api/update/:imgid', function(req, res){
});

// change to app.delete
app.post('/api/delete/:imgid', function(req, res){
});

app.get('/apiimages/:imgid', function(req, res){
  var pathToImage = 'images/'+req.params.imgid;
  console.log('image request for',pathToImage);
  fs.exists(pathToImage, function(exists){
    if(exists){
      fs.read(pathToImage, function(err, data){
        res.end(data);
      });
    }
  });
  res.end('File does not exist at',pathToImage);      
});

var port = process.env.PORT || 8000;
app.listen(port, function(){
  console.log('Listening on port',port);
});