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
  let mashId
  // seed excecuted before all tests and values assigned to variables
  before(() => {
    return dbSeed(test)
    .then(data => {
      userId = data[1][0].id
      mashId = data[0][0].id
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

  it('GET - /api/mash/all', () => {
    return request
    .get('/api/mash/all')
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("all monster mashes")
      expect(res.body.mashes.length).to.equal(5)
    })
  })

  it('GET - /api/mash/getmash/:mashid', () => {
    return request
    .get(`/api/mash/getmash/${mashId}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal(`monster mash with id: ${mashId}`)
      expect(res.body.monstermash).to.be.a('object')
      expect(res.body.monstermash._id).to.equal(mashId)
    })
  });

  it('GET - /api/mash/continuemash', () => {
    return request
    .get('/api/mash/continuemash')
    .set('Authorisation', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.mash.phase).to.equal('body')
      expect(res.body.mash.users.length).to.equal(1)
      expect(res.body.mash.lastModified).to.equal('2018-07-06T15:22:33.000Z')
    })
  });

  it('POST - api/mash/newmash' , () => {
    return request
    .post('/api/mash/newmash')
    .set('Authorisation', `Bearer ${token}`)
    .send({
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAGQCAYAAABWJQQ0AAAbBUlEQVR4Xu3dMXJbZRiG0f+yF1JBSRdSwlJyVbAamPHdCx1u6UJF9oIyCsmMJontkUZ5HOk/tNj+fI/eSfzEwSzDPwQIECBAgAABAgQIEIgEluiOMwQIECBAgAABAgQIEBgCxAgIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIAAAQIECBDIBARIRu0QAQIECBAgQIAAAQICxAYIECBAgAABAgQIEMgEBEhG7RABAgQIECBAgAABAgLEBggQIECAAAECBAgQyAQESEbtEAECBAgQIECAAAECAsQGCBAgQIBAKLBt2/djjD/GGL/s9/v/lmX5c4zx27qub8NPwykCBAg8m4AAeTZ6hwkQIEBgRoFt2+7HGC8Pz77f78eyvP+t+H5d11czenhmAgTmExAg873mnpgAgRMEPvxp9e9jjF/9afUJcN70QYFt2/Yf/+XHAFmWZf/69evvsBEgQGAGAQEyw6vsGQkQOFvg7u7uzbIsPxz/afV+v/9nt9v9ePYH9Y5TCxwHyDHEuq5+T556GR6ewDwCfrGb57X2pAQInCHw6ReLR39l5oW/s38GqHcZX/oOyGFXu93O78n2QYDAFAJ+sZviZfaQBAicK/BIgPg7++eiTv5+XwqQA4nvgEw+DI9PYCIBATLRi+1RCRA4XeChAPF39k+39B7/CwgQSyBAYHYBATL7Ajw/AQKPCjzyHRB/Ym07ZwkIkLPYvBMBAjckIEBu6MX0KAQIXF5g27Y3Y4z3/xH64Z+j/wZEgFyee4qPKECmeJk9JAECjwgIEPMgQIDAIwIffgzvvwLETC4l4KdgXUrSxyFA4FoFBMi1vnI+bwIEMgF/Yp1RT3HIT8Ga4mX2kAQI+A6IDRAgQOB8AQFyvp33/FzAd0CsggCB2QV8B2T2BXh+AgSeFBAgTxJ5gxMEfAfkBCxvSoDATQoIkJt8WT0UAQKXFBAgl9T0sezJBggQmF1AgMy+AM9PgMCTAr5gfJLIG5wgYE8nYHlTAgRuUkCA3OTL6qEIELiUwPFPwTr+EbyHj+//XH0p5bk+jgCZ6/X2tAQIfC4gQKyCAAECjwhs2/bXGOPnw5sIEFO5hIAAuYSij0GAwDULCJBrfvV87gQIfHWBh75YPMTIbrfza+hXfwVu74AAub3X1BMRIHCagN88T/Py1gQITCYgQCZ7wYPH9WN4A2QnCBD4pgUEyDf98vjkCBB4boGHvlgcY/y9rutPz/35uX99Al/alO+oXd/r6DMmQOB8AQFyvp33JEBgAoGHvlhcluXFuq5vJyDwiBcWECAXBvXhCBC4OgEBcnUvmU+YAIFSwBeLpfYct7Ztux9jvPzkae/XdX01h4CnJEBgdoF3rpA2oD959xcAAAAASUVORK5CYII='
    })
    .then(res => {
      expect(res.body.message).to.equal("new monster mash created successfully");
      expect(res.body.mash).to.be.a('object')
      expect(res.status).to.equal(200);
    });
  })


  // failure endpoints
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
    });

    it('GET - /api/mash/getmash/:mashid - ID not found', () => {
      mashId = '6' + mashId.slice(1);
      return request
      .get(`/api/mash/getmash/${mashId}`)
      .then(res => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('monster mash not found');
        expect(res.body.status).to.equal(404);
      });
    });


    it('POST - api/mash/newmash - Body imageData roperty is not called imageData' , () => {
      return request
      .post('/api/mash/newmash')
      .set('Authorisation', `Bearer ${token}`)
      .send({
        wrongpropertyimageData: 'test'
      })
      .then(res => {
        expect(res.body.error).to.equal("imageData property not found");
        expect(res.body.status).to.equal(400)
        expect(res.status).to.equal(400);
      });
    })

    it('POST - api/mash/newmash - No imageData property in body of request' , () => {
      return request
      .post('/api/mash/newmash')
      .set('Authorisation', `Bearer ${token}`)
      .send({})
      .then(res => {
        expect(res.body.error).to.equal("imageData property not found");
        expect(res.body.status).to.equal(400)
        expect(res.status).to.equal(400);
      });
    })
  })
});