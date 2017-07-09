// Note Sometimes tests will fail due to network delay.
import server from '../src/server';
import got from 'got';
import delay from 'delay';
import chai from 'chai';
import {expect} from 'chai';
import chaiRoughly from 'chai-roughly';
import chaiUUID from 'chai-uuid';
import chaiString from 'chai-string';

chai.use(chaiRoughly);
chai.use(chaiUUID);
chai.use(chaiString);

let floatTolerance = 0.000001;

let sampleInputRows = [
  {
    name: 'GOMA',
    address: 'Stanley Pl, South Brisbane QLD 4101'
  },
  {
    name: 'Union Square',
    address: '333 Post St, San Francisco, CA 94108, USA'
  }
];

let sampleOutputRows = [
  {
    name: 'GOMA',
    address: 'Stanley Pl, South Brisbane QLD 4101',
    lat: -27.471349,
    lng: 153.017003
  },
  {
    name: 'Union Square',
    address: '333 Post St, San Francisco, CA 94108, USA',
    lat: 37.787938,
    lng: -122.407506
  }
];

describe('server', function() {
  let app;
  let httpServer;

  beforeEach(function(done) {
    app = server();
    httpServer = app.listen(3001, () => done());
  });

  afterEach(function(done) {
    httpServer.close(() => done());
  });

  describe('/v1', function() {
    it('Should 404 on a non-existant endpoint', async function() {
      try {
        await got('localhost:3001/v1/foobar', {
          method: 'GET',
        });
        expect.fail();
      } catch (error) {
        expect(error.statusCode).to.equal(404);
      }
    });
  });

  describe('/v1/jobs', function() {
    it('Should run a job when given 0 rows', async function() {
      let post = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: []}
      });
      expect(post.statusCode).to.equal(200);
      expect(post.headers['content-type']).to.match(/^application\/json/);
      expect(post.body.id).to.be.a.uuid();
      let get = await got(`localhost:3001/v1/jobs/${post.body.id}`, {
        method: 'GET',
        json: true
      });
      expect(get.statusCode).to.equal(200);
      expect(get.headers['content-type']).to.match(/^application\/json/);
      expect(get.body).to.deep.equal({rows: []});
    });

    it('Should return 202 when a job hasn\'t finished', async function() {
      let post = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: sampleInputRows}
      });
      expect(post.statusCode).to.equal(200);
      expect(post.headers['content-type']).to.match(/^application\/json/);
      expect(post.body.id).to.be.a.uuid();
      let get = await got(`localhost:3001/v1/jobs/${post.body.id}`, {
        method: 'GET',
        json: true
      });
      expect(get.statusCode).to.equal(202);
    });

    it('Should return 200 when the job has finished', async function() {
      let post = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: sampleInputRows}
      });
      expect(post.statusCode).to.equal(200);
      expect(post.headers['content-type']).to.match(/^application\/json/);
      expect(post.body.id).to.be.a.uuid();
      await delay(1800);
      let get = await got(`localhost:3001/v1/jobs/${post.body.id}`, {
        method: 'GET',
        json: true
      });
      expect(get.statusCode).to.equal(200);
      expect(get.headers['content-type']).to.match(/^application\/json/);
      expect(get.body)
        .to.roughly(floatTolerance).deep.equal({rows: sampleOutputRows});
    });

    it('Should handle multiple POSTs and GETs', async function() {
      let postA = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: [sampleInputRows[0]]}
      });
      expect(postA.statusCode).to.equal(200);
      expect(postA.headers['content-type']).to.match(/^application\/json/);
      expect(postA.body.id).to.be.a.uuid();
      let postB = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: [sampleInputRows[1]]}
      });
      expect(postB.statusCode).to.equal(200);
      expect(postB.headers['content-type']).to.match(/^application\/json/);
      expect(postB.body.id).to.be.a.uuid();
      expect(postA.body.id).to.not.equal(postB.body.id);
      await delay(1800);
      let getA = await got(`localhost:3001/v1/jobs/${postA.body.id}`, {
        method: 'GET',
        json: true
      });
      expect(getA.statusCode).to.equal(200);
      expect(getA.headers['content-type']).to.match(/^application\/json/);
      expect(getA.body)
        .to.roughly(floatTolerance).deep.equal({rows: [sampleOutputRows[0]]});
      let getB = await got(`localhost:3001/v1/jobs/${postB.body.id}`, {
        method: 'GET',
        json: true
      });
      expect(getB.statusCode).to.equal(200);
      expect(getB.headers['content-type']).to.match(/^application\/json/);
      expect(getB.body)
        .to.roughly(floatTolerance).deep.equal({rows: [sampleOutputRows[1]]});
    });

    it('GET should 404 on a non-existant job', async function() {
      let post = await got('localhost:3001/v1/jobs', {
        method: 'POST',
        json: true,
        body: {rows: sampleInputRows}
      });
      expect(post.statusCode).to.equal(200);
      expect(post.headers['content-type']).to.match(/^application\/json/);
      expect(post.body.id).to.be.a.uuid();
      await delay(1800);
      try {
        let uuid = '9a7414b0-61f5-11e7-853d-abd8a983b119';
        await got(`localhost:3001/v1/jobs/${uuid}`, {
          method: 'GET',
          json: true
        });
        chai.fail();
      } catch (error) {
        expect(error.statusCode).to.equal(404);
      }
    });

    it('POST should 400 on invalid JSON', async function() {
      try {
        await got('localhost:3001/v1/jobs', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: '{rows: []'
        });
        chai.fail();
      } catch (error) {
        expect(error.statusCode).to.equal(400);
      }
    });

    it('POST should 400 on improperly structured input', async function() {
      try {
        await got('localhost:3001/v1/jobs', {
          method: 'POST',
          json: true,
          body: {rows: sampleOutputRows}
        });
        chai.fail();
      } catch (error) {
        expect(error.statusCode).to.equal(400);
      }
    });
  });

  it('GET / should return a HTML page', async function() {
    let get = await got('localhost:3001');
    expect(get.statusCode).to.equal(200);
    expect(get.headers['content-type']).to.match(/^text\/html/);
    expect(get.body).to.startWith('<!DOCTYPE html>');
  });

  it('GET /bundle.js should return a JS file', async function() {
    let get = await got('localhost:3001/bundle.js');
    expect(get.statusCode).to.equal(200);
    expect(get.headers['content-type']).to.match(/^application\/javascript/);
    expect(get.body).to.include('var'); // If this passes it's probably valid JS
  });
});
