var app = require('express');
var fs = require('fs');
var bodyparser = require('bodyparser')

var port = process.env.PORT || 8000;

app.post('/api/images:imgid', function(req, res){
  var path = req.path //store path in a db
  fs.exists(path, function(exists){
    if(!exists){
      var messageToWrite = req.body + '';
      fs.writeFile(path, messageToWrite, function(){
        res.end('<img src = ' + apipath + '>')
      });
    }
  });
});

app.post('/api/edit:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      var messageToWrite = req.body + '';
      fs.writeFile(path, messageToWrite, function(){
        res.end('edited');
      });
    }
  });
});

app.post('/api/replace:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      fs.writeFile(path, '', function(){
        res.end('overwritten');
      });
    }
  });
});

app.get('/api/images:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      fs.read(path, function(err, data){
        res.end(data);
      });
    }
  });
});

app.listen(port)