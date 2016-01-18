const crypto = require('crypto');

function urlHash(poll) {
  poll.id = crypto.createHash('md5').update(poll.title + Date.now()).digest('hex');
  poll.adminUrl = crypto.createHash('md5').update(poll.responses[0] + Date.now()).digest('hex');
  return poll;
}

module.exports = urlHash;
