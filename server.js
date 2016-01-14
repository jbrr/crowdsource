const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIo = require('socket.io');
const crypto = require('crypto');
var poll = {};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/poll', function(req, res) {
  poll = req.body.poll;
  var adminUrl = crypto.createHash('md5').update(poll.title + Date.now()).digest('hex');
  var pollUrl = crypto.createHash('md5').update(poll.responses[0] + Date.now()).digest('hex');
  console.log(req.body.title);
  res.send("<div><a href=>'/" + adminUrl + "/" + pollUrl + "'>Admin URL</a><br><a href=>'/poll/" + pollUrl + "'>Poll URL</a>")
});

app.get('/admin/:id', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

const server = http.createServer(app).listen(port, function () {
  console.log('I did it ma!');
});

const io = socketIo(server);

io.on('connection', function(socket) {
  socket.emit('links', poll)
});

module.exports = server;
