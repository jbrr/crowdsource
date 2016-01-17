var socket = io();
var inputCounter = 2;
var inputLimit = 10;
var pollTitle = document.getElementById('poll-title');
var pollOptions = document.getElementById('poll-options');
var buttons = document.querySelectorAll('#poll-options button');
var pollResults = document.getElementById('poll-results')
var pollId = window.location.pathname.split('/')[2];
var addOptions = document.getElementById('add-option');
var dynamicInput = document.getElementById('dynamic-input');
var endButton = document.getElementById('ender');
var pollOverDisplay = document.getElementById('poll-over');
var voteTally = {};

if (addOptions) {
  addOptions.addEventListener('click', addInput);
}

function addInput() {
  if (inputCounter === inputLimit) {
    alert("You have reached the limit of adding " + inputCounter + " options.");
  } else {
    inputCounter++;
    var newInput = document.createElement('div');
    newInput.innerHTML = `<input type='text' placeholder='Response ${inputCounter}' class='poll-response' name="poll[responses]" id='response-${inputCounter}'>`;
    dynamicInput.appendChild(newInput);
  }
}

function displayVotes(poll) {
  if ((poll['user-results'] && (window.location.pathname.split('/')[1] === 'poll')) || window.location.pathname.split('/')[1] !== 'poll') {
    pollResults.innerHTML = "";
    for (key in poll.voteTally) {
      var result = document.createElement('div');
      result.innerHTML = `<p>${key} - ${poll.voteTally[key]}</p>`;
      pollResults.appendChild(result);
    }
  }
}

if (endButton) {
  endButton.addEventListener('click', function() {
    socket.send('endPoll' + pollId, pollId);
  });
}

socket.on('pollOver' + pollId, function(message) {
  pollOverDisplay.innerHTML = "<b>Poll is now closed</b>";
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.display = 'none';
  }
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast' + pollId, { vote: this.innerText, id: pollId });
  });
}

socket.on('voteCount' + pollId, function(message) {
  displayVotes(message);
});
