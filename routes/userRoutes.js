const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models')

router.post("/signin", (req, res, next) => {
  models.User.findOne({username: req.body.username})
  .then(user => {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).send({
        message: "auth successful"
      })
    } else {
      next({status: 401, error: "auth failed"})
    }
  })
  .catch(err => console.log(err))
});

module.exports = router;