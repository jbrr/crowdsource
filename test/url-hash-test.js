const assert = require('assert');
const urlHash = require('../lib/url-hash');

describe('urlHash', function() {
  it('should attach an ID to a poll', function() {
    var poll = {
      title: 'Test Poll',
      responses: ['option 1, option 2']
    }

    urlHash(poll);
    assert(poll.id);
  });

  it('should generate unique IDs for polls', function() {
    var poll = {
      title: 'Test Poll',
      responses: ['option 1, option 2']
    }

    var differentPoll = {
      title: 'Different Test Poll',
      responses: ['new option 1', 'new option 2']
    }

    urlHash(poll);
    urlHash(differentPoll);

    assert.notEqual(poll.id, differentPoll.id);
  });

  it('should attach an adminUrl to a poll', function() {
    var poll = {
      title: 'Test Poll',
      responses: ['option 1, option 2']
    }

    urlHash(poll);
    assert(poll.adminUrl);
  });

  it('should generate unique IDs for polls', function() {
    var poll = {
      title: 'Test Poll',
      responses: ['option 1, option 2']
    }

    var differentPoll = {
      title: 'Different Test Poll',
      responses: ['new option 1', 'new option 2']
    }

    urlHash(poll);
    urlHash(differentPoll);

    assert.notEqual(poll.adminUrl, differentPoll.adminUrl);
  });
});
