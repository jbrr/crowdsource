var socket = io();
var inputCounter = 2;
var inputLimit = 10;

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
