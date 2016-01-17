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
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/poll', function(req, res) {
  var poll = req.body.poll;
  urlHash(poll);
  var id = poll.id;
  polls[id] = poll;
  poll['votes'] = {};
  res.send("<div><a href='/" + poll.adminUrl + "/" + poll.id + "'>Admin URL</a><br><a href='/poll/" + poll.id + "'>Poll URL</a></div>")
});

app.get('/poll/:id', function(req, res) {
    var poll = polls[req.params.id];
    console.log(poll);
    res.render('user-poll', { poll: poll });
});

app.get('/:adminUrl/:id', function(req, res) {
  var poll = polls[req.params.id];
  if (poll.adminUrl === req.params.adminUrl) {
    res.render('admin', { poll: poll });
  } else {
    res.send("404");
  }
});

const server = http.createServer(app).listen(port, function () {
  console.log('I did it ma!');
});

const io = socketIo(server);

io.on('connection', function(socket) {
  console.log("A user has connected");
  socket.on('message', function(channel, message) {
    if (channel === 'voteCast' + message.id) {
      var poll = polls[message.id];
      poll['votes'][socket.id] = message.vote;
      tallyVotes(poll);
      io.sockets.emit('voteCount' + message.id, poll);
    }
  });
});

function urlHash(poll) {
  poll.id = crypto.createHash('md5').update(poll.title + Date.now()).digest('hex');
  poll.adminUrl = crypto.createHash('md5').update(poll.responses[0] + Date.now()).digest('hex');
  return poll;
}

function tallyVotes(poll) {
  poll['voteTally'] = {};
  for (key in poll.votes) {
    if (poll.votes.hasOwnProperty(key)) {
      var value = poll.votes[key];
      if (!poll['voteTally'][value]) {
        poll['voteTally'][value] = 1;
      } else {
        poll['voteTally'][value] += 1;
      }
    }
  }
}

module.exports = server;
