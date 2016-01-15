var socket = io();
var inputCounter = 2;
var inputLimit = 10;
var pollOptions = document.getElementById('poll-options');

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

function getId(polls) {
  return window.location.pathname.split('/')[2];
}

socket.on('voteCast', function(obj) {
  console.log(obj);
  var id = getId(obj);
  var poll = obj[id];
  pollOptions.innerText = poll.title + " - " + poll.responses;
});
