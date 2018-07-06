process.env.NODE_ENV = 'test'

const { test } = require('../dbconnection/index')
const mongoose = require('mongoose')
const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
const dbSeed = require('../seed/seed');

describe('API Endpoints - Success', () => {
  // variables to keep track of id's
  let token
  let userId
  // seed excecuted before all tests and values assigned to variables
  before(() => {
    return dbSeed(test)
    .then(data => {
      userId = data[0].id
      console.log('seeding complete')
    })
    .catch(err => {
      console.log(err);
    });
  });
  // disconnect from DB after all tests
  after(() => {
    return mongoose.disconnect()
    .catch(err => {
      console.log(err);
    });
  });
  
  it('POST - /api/user/signin', () => {
    return request
    .post('/api/user/signin')
    .send({
      username: "user1",
      password: "password1",
    })
    .then(res => {
      expect(res.body.message).to.equal("auth successful");
      expect(res.body.token).to.be.a('string')
      expect(res.status).to.equal(200);
      token = res.body.token
    });
  });

  it('GET - /api/user', () => {
    return request
    .get('/api/user')
    .set('Authorisation', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(userId)
      expect(res.body.username).to.equal('user1')
    })
  })

  it('POST - /api/user/signup', () => {
    return request
    .post('/api/user/signup')
    .send({
      username: "user5",
      password: "password5",
    })
    .then(res => {
      expect(res.body.message).to.equal("user successfully created");
      expect(res.body.token).to.be.a('string')
      expect(res.status).to.equal(200);
    });
  })

  describe('API Endpoints - Failure', () => {
    it('POST - /api/user/signin - Incorrect password', () => {
      return request
      .post('/api/user/signin')
      .send({
        username: "user1",
        password: "thisisthewrongpassword",
      })
      .then(res => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('auth failed');
        expect(res.body.status).to.equal(401);
      });
    });

    it('POST - /api/user/signin - Incorrect user', () => {
      return request
      .post('/api/user/signin')
      .send({
        username: "thisuserdoesnotexist",
        password: "password",
      })
      .then(res => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('user not found');
        expect(res.body.status).to.equal(404);
      });
    });

    it('GET - /api/user - No token in header', () => {
      return request
      .get('/api/user')
      .then(res => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('auth failed');
        expect(res.body.status).to.equal(401);
      })
    })

    it('GET - /api/user - Incorrect token in header', () => {
      return request
      .get('/api/user')
      .set('Authorisation', `Bearer ${token}moretokenstuff`)
      .then(res => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('auth failed');
        expect(res.body.status).to.equal(401);
      })
    })

    it('POST - /api/user/signup - username already exists', () => {
      return request
      .post('/api/user/signup')
      .send({
        username: "user1",
        password: "password1",
      })
      .then(res => {
        expect(res.body.status).to.equal(400);
        expect(res.body.error).to.equal("username already exists");
        expect(res.status).to.equal(400);
      });
    })
  })
});