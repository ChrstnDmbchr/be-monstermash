if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const models = require('../models');

const userData = require(`./${process.env.NODE_ENV}Data/users`);
const mashData = require(`./${process.env.NODE_ENV}Data/monsterMashes`);

function dbSeed (dbUrl) {
  let user1
  let user2

  return mongoose.connection.dropDatabase()
  .then(() => {
    console.log(`${process.env.NODE_ENV} db dropped`);
    return Promise.all([models.User.insertMany(userData)]);
  })
  .then(([userData]) => {
    console.log(`${userData.length} Users seeded`)
    user1 = userData[0]._id
    user2 = userData[1]._id
    user3 = userData[2]._id
    
    const mashes = mashData.map((mash, i) => {
      if (i === 1) {
        mash.users.push(user1, user2)
        return mash
      } else if (i === 3 || i === 4) {
        mash.users.push(user3)
        return mash
      } else {
        mash.users.push(user1)
        return mash
      };
    });
    
    return Promise.all([models.Mash.insertMany(mashes), userData])
  })
  .then(([mashes, userData]) => {
    console.log(`${mashes.length} Monster Mashes seeded`)
    return[mashes, userData]
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports = dbSeed;