var socket = io();
var inputCounter = 2;
var inputLimit = 10;
var pollTitle = document.getElementById('poll-title');
var pollOptions = document.getElementById('poll-options');
var buttons = document.querySelectorAll('#poll-options button');
var pollResults = document.getElementById('poll-results')
var pollId = window.location.pathname.split('/')[2];
var voteTally = {};

function addInput(elementName) {
  if (inputCounter === inputLimit) {
    alert("You have reached the limit of adding " + inputCounter + " options.");
  } else {
    inputCounter++;
    var newInput = document.createElement('div');
    newInput.innerHTML = `<input type='text' placeholder='Response ${inputCounter}' class='poll-response' name="poll[responses][]" id='response-${inputCounter}'>`;
    document.getElementById(elementName).appendChild(newInput);
  }
}

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast' + pollId, { vote: this.innerText, id: pollId });
  });
}

socket.on('voteCount' + pollId, function(message) {
  displayVotes(message);
  console.log(message);
});

function displayVotes(poll) {
  pollResults.innerHTML = "";
  for (key in poll.voteTally) {
    var result = document.createElement('div');
    result.innerHTML = `<p>${key} - ${poll.voteTally[key]}</p>`;
    pollResults.appendChild(result);
  }
}
