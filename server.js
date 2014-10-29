var express = require('express');
var fs = require('fs');

var port = process.env.PORT || 8000;

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req,res){
  res.redirect('/client/')
})

app.post('/api/create/:imgid', function(req, res){
  console.log(app.param);
  var path = app.param //store path in a db
  fs.exists(path, function(exists){
    if(!exists){
      var messageToWrite = String(req.body);
      fs.writeFile(path, messageToWrite, function(){
        res.end('<img src=' + path + '>');
      });
    }
  });
});

app.put('/api/update/:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      var messageToWrite = req.body + '';
      fs.writeFile(path, messageToWrite, function(){
        res.end('updated');
      });
    }
  });
});

app.delete('/api/delete/:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      fs.writeFile(path, '', function(){
        res.end('deleted');
      });
    }
  });
});

app.get('/api/images/:imgid', function(req, res){
  var path = req.path;
  fs.exists(path, function(exists){
    if(exists){
      fs.read(path, function(err, data){
        res.end(data);
      });
    }
  });
});

app.listen(port, function(){
  console.log('Listening on port',port);
});