require("http").createServer(function (req, res) {
  res.end("Hello from server started by Electron app!");
})
var express = require('express');
var api = express();

var things = require('../src/things');

//both index.js and things.js should be in same directory
api.use('/api', things);


api.listen(3001, function () {
    console.log('API reimagine listening on port 3001!');
});