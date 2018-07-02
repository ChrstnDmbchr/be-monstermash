const mongoose = require('mongoose');
const { dev } = require('../dbconnection');
const dbSeed = require('../seed/seed');

mongoose.connect(dev)
.then(() => {
  return dbSeed(dev);
})
.then(() => {
  mongoose.disconnect();
})
.catch(err => {
  console.log(err);
});