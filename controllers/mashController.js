const models = require('../models');
const mongoose = require('mongoose')

exports.getAll = (req, res, next) => {
  models.Mash.find({})
  .then(mashes => {
    res.status(200).send({
      message: "all monster mashes",
      mashes
    });
  })
  .catch(err => {
    next({status: 500, error: err});
  });
};

exports.getByID = (req, res, next) => {
  models.Mash.findById(req.params.mashid)
  .then(mash => {
    if (!mash) {
      return next({status: 404, error: 'monster mash not found'})
    }
    res.status(200).send({
      message: `monster mash with id: ${req.params.mashid}`,
      monstermash: mash
    });
  })
  .catch(err => {
    next({status: 500, error: err});
  });
};

exports.postNewMash = (req, res, next) => {
  res.status(200).send({
    message: "post new route working"
  })
}

exports.getOldest = (req, res, next) => {
  models.Mash.findOne({users: { $nin: [mongoose.Types.ObjectId(req.userData.id)] }})
  .sort({lastModified: 1}).limit(1)
  .then(mash => {
    if (!mash) {
      return next({status: 404, error: 'no suitable mashes found'})
    }
    res.status(200).send({ mash });
  })
  .catch(err => {
    next({status: 500, error: err})
  });
};

exports.postContinueMash = (req, res, next) => {
  res.status(200).send({
    message: "post continue route working",
    id: `req.params.id`
  })
}