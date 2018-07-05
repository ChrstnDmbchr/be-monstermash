if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const models = require('../models');

const userData = require(`./${process.env.NODE_ENV}Data/users`);

function dbSeed (dbUrl) {
  return mongoose.connection.dropDatabase()
  .then(() => {
    console.log(`${process.env.NODE_ENV} db dropped`);
    return Promise.all([models.User.insertMany(userData)]);
  })
  .then(([userData]) => {
    console.log(`${userData.length} Users seeded`)
    return userData
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports = dbSeed;