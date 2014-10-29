var express = require('express');
var fs = require('fs');

var port = process.env.PORT || 8000;

var app = express();
app.use(express.static(__dirname));
app.get('/', function(req,res){
  res.redirect('/client/')
})

app.post('/api/create/:imgid', function(req, res){
  var path = req.params.imgid;
  console.log('image created at',path);
  fs.exists(path, function(exists){
    if(!exists){
      var messageToWrite = String(req.body);
      fs.writeFile(path, messageToWrite, function(){
        res.end('<img src=' + path + '>');
      });
    }
  });
});

// change to app.put
app.post('/api/update/:imgid', function(req, res){
  var path = req.params.imgid;
  console.log('image updated:',path);
  fs.exists(path, function(exists){
    if(exists){
      var messageToWrite = req.body + '';
      fs.writeFile(path, messageToWrite, function(){
        res.end('updated');
      });
    }
  });
});

// change to app.delete
app.post('/api/delete/:imgid', function(req, res){
  var path = req.params.imgid;
  console.log('image deleted from',path);
  fs.exists(path, function(exists){
    if(exists){
      fs.writeFile(path, '', function(){
        res.end('deleted');
      });
    }
  });
});

app.get('/api/images/:imgid', function(req, res){
  var path = req.params.imgid;
  console.log('image request for',path);
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