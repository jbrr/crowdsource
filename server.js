const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 3000;
const path = require('path');
const socketIo = require('socket.io');
const urlHash = require('./lib/url-hash');
const tallyVotes = require('./lib/tally-votes');

app.locals.title = 'Crowdsource';
app.locals.polls = {};

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
  app.locals.polls[id] = poll;
  poll['votes'] = {};
  poll['closed'] = false;
  if (req.body.minutesToClose) {
    calculateClosingTime(poll, new Date(), req.body.minutesToClose);
  }
  res.send("<div><a href='/" + poll.adminUrl + "/" + poll.id + "'>Admin URL</a><br><a href='/poll/" + poll.id + "'>Poll URL</a></div>")
});

app.get('/poll/:id', function(req, res) {
    var poll = app.locals.polls[req.params.id];
    if (poll['closed'] === false) {
      res.render('user-poll', { poll: poll });
    } else {
      res.send('404');
    }
});

app.get('/:adminUrl/:id', function(req, res) {
  var poll = app.locals.polls[req.params.id];
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
      var poll = app.locals.polls[message.id];
      poll['votes'][socket.id] = message.vote;
      tallyVotes(poll);
      io.sockets.emit('voteCount' + message.id, poll);
    } else if (channel === 'endPoll' + message) {
      closePoll(message);
    }
  });
});

function closePoll(id) {
  app.locals.polls[id]['closed'] = true;
  io.sockets.emit('pollOver' + id, app.locals.polls[id]);
}

function calculateClosingTime(poll, date, minutes) {
  var newDate = new Date(date.getTime() + minutes*60000);
  var closingTime = newDate - date;
  setTimeout(function() {
    closePoll(poll.id);
  }, closingTime);
}

if (!module.parent) {
  app.listen(app.get('port'), function() {
    console.log("We're really doing it!");
  });
}

module.exports = app;
