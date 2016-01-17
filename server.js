const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIo = require('socket.io');
const urlHash = require('./url-hash');
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
  var now = new Date();
  urlHash(poll);
  var id = poll.id;
  polls[id] = poll;
  poll['votes'] = {};
  if (req.body.minutesToClose) {
    calculateClosingTime(poll, now, req.body.minutesToClose);
  }
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
    } else if (channel === 'endPoll' + message) {
      closePoll(message, channel);
    }
  });
});

function closePoll(id, channel) {
  io.sockets.emit('pollOver' + id, polls[id]);
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

function calculateClosingTime(poll, date, minutes) {
  var newDate = new Date(date.getTime() + minutes*60000);
  var closingTime = newDate - date;
  setTimeout(function() {
    closePoll(poll.id, 'endPoll' + poll.id);
  }, closingTime);
}

module.exports = server;
