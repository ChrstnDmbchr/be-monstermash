const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const tokenSecret = require('../config').tokenSecret;

router.get("/:userId", (req, res, next) => {
  models.User.findById(req.params.userId)
  .then(user => {
    if (!user) return next({status: 404, error: 'user not found'});
    res.status(200).send({ user });
  })
  .catch(err => next({status: 500, error: err}));
});

router.post("/signin", (req, res, next) => {
  models.User.findOne({username: req.body.username})
  .then(user => {
    if (!user) return next({status: 404, error: "user not found"});
    return Promise.all([bcrypt.compare(req.body.password, user.password), user]);
  })
  .then(([result, user]) => {
    if (result) {
      const token = jwt.sign({ id: user._id }, tokenSecret);
      res.status(200).send({
        message: "auth successful",
        token,
        id: user._id
      });
    } else {
      next({status: 401, error: "auth failed"});
    }
  })
  .catch(err => {
    next({status: 500, error: err});
  });
});

module.exports = router;