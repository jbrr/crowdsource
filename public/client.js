var io = io();
var inputCounter = 1;
var inputLimit = 10;

function addInput(elementName) {
  if (inputCounter === inputLimit) {
    alert("You have reached the limit of adding " + inputCounter + " options.");
  } else {
    inputCounter++;
    var newInput = document.createElement('div');
    newInput.innerHTML = `<input type='text' placeholder='Response ${inputCounter}' class='poll-response'>`;
    document.getElementById(elementName).appendChild(newInput);
  }
}
