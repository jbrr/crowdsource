function timeDifference(date, minutes) {
  var newDate = new Date(date.getTime() + minutes * 60000);
  return newDate - date;
}

module.exports = timeDifference;
