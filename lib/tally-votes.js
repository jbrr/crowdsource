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

module.exports = tallyVotes;
