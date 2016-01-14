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
  var adminUrl, pollUrl;
  var urlHashes = urlHash(poll, adminUrl, pollUrl);

  res.send("<div><a href='/" + urlHashes.adminUrl + "/" + urlHashes.pollUrl + "'>Admin URL</a><br><a href='/poll/" + urlHashes.pollUrl + "'>Poll URL</a>")
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

function urlHash(poll, adminUrl, pollUrl) {
  adminUrl = crypto.createHash('md5').update(poll.title + Date.now()).digest('hex');
  pollUrl = crypto.createHash('md5').update(poll.responses[0] + Date.now()).digest('hex');
  return { adminUrl: adminUrl,
           pollUrl: pollUrl};
}

module.exports = server;
