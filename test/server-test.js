const assert = require('assert');
const request = require('request');
const app = require('../server');
const fixtures = require('./fixtures');

describe('Server', function() {
  before(function(done) {
    this.port = 9876;
    this.server = app.listen(this.port, function(error, result) {
      if (error) {return done(error); }
      done();
    });
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(function() {
    this.server.close();
  });

  it('should exist', function() {
    assert(app);
  });

  describe('GET /', function() {

    it('should return a 200', function(done) {
      this.request.get('/', function(error, response) {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have a body with the name of the application', function(done) {
      var title = app.locals.title;

      this.request.get('/', function(error, response) {
        if(error) { done(error); }
        assert(response.body.includes(title),
              `"${response.body}" does not include "${title}"`);
        done();
      });
    });
  });

  describe('POST /poll', function() {

    beforeEach(function() {
      app.locals.polls = {};
    });

    it('should not return a 404', function(done) {
      var payload = {poll: fixtures.validPoll};

      this.request.post('/poll', {form: payload}, function(error, response) {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should receive and store data', function(done) {
      var payload = {poll: fixtures.validPoll};

      this.request.post('/poll', {form: payload}, function(error, response) {
        if (error) { done(error); }
        var pollCount = Object.keys(app.locals.polls).length;
        assert.equal(pollCount, 1, `Expected 1 poll, found ${pollCount}`);
        done();
      });
    });

    it('should display links to admin and user polls', function(done) {
      var payload = {poll: fixtures.validPoll};

      this.request.post('/poll', {form: payload}, function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes('Poll URL'));
        assert(response.body.includes('Admin URL'));
        done();
      });
    });
  });

  describe('GET /poll/:id', function(done) {

    beforeEach(function() {
      app.locals.polls.testPoll = fixtures.validPoll;
    });

    it('should not return a 404', function(done) {
      this.request.get('poll/testPoll', function(error, response) {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should return a page that has the title of the poll', function(done) {
      var poll = app.locals.polls.testPoll;

      this.request.get('poll/testPoll', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(poll.title), `"${response.body}" does not include "${poll.title}"`);
        done();
      });
    });

    it('should return a page with the poll responses', function(done) {
      var poll = app.locals.polls.testPoll;

      this.request.get('poll/testPoll', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(poll.responses[0]),
              `"${response.body}" does not include "${poll.responses[0]}"`);
        done();
      });
    });
  });

  describe('GET /:adminUrl/:id', function(done) {

    beforeEach(function() {
      app.locals.polls.testPoll = fixtures.validPoll;
    });

    it('should not return a 404', function(done) {
      this.request.get('/adminUrl/testPoll', function(error, response) {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should return a page that has the title of the poll', function(done) {
      var poll = app.locals.polls.testPoll;

      this.request.get('adminUrl/testPoll', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(poll.title), `"${response.body}" does not include "${poll.title}"`);
        done();
      });
    });

    it('should not return a page that has the title of the poll with wrong admin url', function(done) {
      var poll = app.locals.polls.testPoll;

      this.request.get('wrongAdminUrl/testPoll', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(404), `"${response.body}" does not include 404`);
        done();
      });
    });

    it('should return a page with the poll responses', function(done) {
      var poll = app.locals.polls.testPoll;

      this.request.get('adminUrl/testPoll', function(error, response) {
        if (error) { done(error); }
        assert(response.body.includes(poll.responses[0]),
              `"${response.body}" does not include "${poll.responses[0]}"`);
        done();
      });
    });
  });
});
