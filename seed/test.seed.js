process.env.NODE_ENV = 'test'

const mongoose = require('mongoose');
const { test } = require('../dbconnection');
const dbSeed = require('../seed/seed');

mongoose.connect(test)
.then(() => {
  return dbSeed(test);
})
.then(() => {
  mongoose.disconnect();
})
.catch(err => {
  console.log(err);
});