const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIo = require('socket.io');
var poll = {};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', function(req, res) {
  console.log(req.body, req.params);
  res.send(req.body);
})

app.get('/admin/:id', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

const server = http.createServer(app).listen(port, function () {
  console.log('I did it ma!');
});

const io = socketIo(server);

io.on('connection', function(socket) {
  socket.on('message', function(channel, message) {
    if (channel === "pollOptions") {
      poll[socket.id] = message;
      console.log(message);
    }
  });
});

module.exports = server;
