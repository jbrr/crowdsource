const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

http.listen(process.env.PORT || 3000, function() {
  console.log("I did it ma!");
});
