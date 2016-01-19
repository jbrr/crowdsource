const assert = require('assert');
const timeDifference = require('../lib/time-difference')

describe('timeDifference', function() {
  it('calculates the difference between two dates in ms', function() {
    var date = new Date();
    var minutes = 5;

    var diff = timeDifference(date, minutes);
    assert.equal(diff, 300000);
  })
})
