var socket = io();
var inputCounter = 2;
var inputLimit = 10;
var pollTitle = document.getElementById('poll-title');
var pollOptions = document.getElementById('poll-options');
var buttons = document.querySelectorAll('#poll-options button');
var pollId = window.location.pathname.split('/')[2];

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

// function getId(polls) {
//   return window.location.pathname.split('/')[2];
// }
//
// function parseResponses(responses) {
//   for (var i = 0; i < responses.length; i++) {
//     var newResponse = document.createElement('div');
//     newResponse.innerHTML = `<p>${responses[i]}</p>`;
//     pollOptions.appendChild(newResponse);
//   }
// }
//
// socket.on('voteCast', function(obj) {
//   console.log(obj);
//   var id = getId(obj);
//   var poll = obj[id];
//   pollTitle.innerHTML = "<h2>" + poll.title + "</h2>";
//   parseResponses(poll.responses);
// });
