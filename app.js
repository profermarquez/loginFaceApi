var express = require('express');

const path = require('path');
var app = express();
var favicon = require('serve-favicon');//npm install serve-favicon
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use('/public/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/models', express.static(path.resolve(__dirname, 'public/models')));
app.use('/labeled_images', express.static(path.resolve(__dirname, 'labeled_images')));

app.get('/', function (req, res) {
    
  res.sendFile(path.join(__dirname+'/sites/index.html'));

});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});