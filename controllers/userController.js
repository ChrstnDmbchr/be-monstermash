const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tokenSecret = process.env.MONGODB_URI ? process.env.TOKEN_SECRET : require('../config').tokenSecret
const saltRounds = process.env.MONGODB_URI ? process.env.SALT_ROUNDS : require('../config').saltRounds

exports.getUser = (req, res, next) => {
  models.User.findById(req.userData.id)
  .then(user => {
    if (!user) return next({status: 404, error: 'user not found'});
    res.status(200).send({
      id: user._id,
      username: user.username
    });
  })
  .catch(err => next({status: 500, error: err}));
};

exports.signUserIn = (req, res, next) => {
  models.User.findOne({username: req.body.username})
  .then(user => {
    if (!user) return next({status: 404, error: "user not found"});
    return Promise.all([bcrypt.compare(req.body.password, user.password), user]);
  })
  .then(([result, user]) => {
    if (result) {
      const token = jwt.sign({ id: user._id }, tokenSecret, { expiresIn: "1h" });
      res.status(200).send({
        message: "auth successful",
        token
      });
    } else {
      next({status: 401, error: "auth failed"});
    };
  })
  .catch(err => {
    next({status: 500, error: err});
  });
};

exports.signUserUp = (req, res, next) => {
  models.User.findOne({ username: req.body.username })
  .then(user => {
    console.log(user)
    if (!user) {
      return models.User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, saltRounds)
      })
    } else {
      next({status: 400, error: 'username already exists'})
    };
  })
  .then(newUser => {
    const token = jwt.sign({ id: newUser._id }, tokenSecret, { expiresIn: "1h" });
    res.status(200).send({
      message: "user successfully created",
      token
    });
  })
  .catch(err => {
    next({status: 500, error: err});
  });
};