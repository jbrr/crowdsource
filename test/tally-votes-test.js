const assert = require('assert');
const tallyVotes = require('../lib/tally-votes');

describe('tallyVotes', function() {
  it('counts instances of a certain vote', function() {
    var poll = {
      title: 'Test poll',
      responses: ['cool', 'stuff', 'here'],
      votes: {
        firstUser: 'cool',
        secondUser: 'cool',
        thirdUser: 'stuff'
      }
    }

    tallyVotes(poll);
    assert.equal(poll.voteTally['cool'], 2);
    assert.equal(poll.voteTally['stuff'], 1);
  });
});
