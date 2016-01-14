const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIo = require('socket.io');
const crypto = require('crypto');
var polls = {};

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/poll', function(req, res) {
  var poll = req.body.poll;
  urlHash(poll);
  var id = poll.id;
  polls[id] = poll;
  res.send("<div><a href='/" + poll.adminUrl + "/" + poll.id + "'>Admin URL</a><br><a href='/poll/" + poll.id + "'>Poll URL</a></div>")
});

app.get('/poll/:id', function(req, res) {
    var poll = polls[req.params.id];
    res.render('user-poll', {title: poll.title});
});

app.get('/:adminUrl/:id', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

const server = http.createServer(app).listen(port, function () {
  console.log('I did it ma!');
});

const io = socketIo(server);

// io.on('connection', function(socket) {
//   socket.emit('links', poll)
// });

function urlHash(poll) {
  poll.id = crypto.createHash('md5').update(poll.title + Date.now()).digest('hex');
  poll.adminUrl = crypto.createHash('md5').update(poll.responses[0] + Date.now()).digest('hex');
  return poll;
}

module.exports = server;
