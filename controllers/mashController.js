const models = require('../models');
const mongoose = require('mongoose');
const moment = require('moment');

exports.getAll = (req, res, next) => {
  models.Mash.find({phase: 'completed'})
  .then(mashes => {
    res.status(200).send({
      message: "all completed monster mashes",
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
  if (!req.body.imageData) {
    return next({status: 400, error: "imageData property not found"});
  }
  models.Mash.create({
    users: [mongoose.Types.ObjectId(req.userData.id)],
    phase: 'body',
    imageData: req.body.imageData,
    votes: 0,
    lastModified: moment().format()
  })
  .then(mash => {
    res.status(201).send({
      message: "new monster mash created successfully",
      mash
    });
  })
  .catch(err => {
    next({status: 500, error: err});
  });
};

exports.getOldest = (req, res, next) => {
  models.Mash.findOne({users: { $nin: [mongoose.Types.ObjectId(req.userData.id)] }, phase: { $ne: 'completed' }})
  .sort({lastModified: 1})
  .then(mash => {
    if (!mash) {
      return next({status: 404, error: 'no suitable mashes found'});
    }
    res.status(200).send({ mash });
  })
  .catch(err => {
    next({status: 500, error: err})
  });
};

exports.postContinueMash = (req, res, next) => {
  if (!req.body.currPhase || !req.body.imageData) {
    return next({status: 400, error: "body missing either currPhase or ImageData properties"});
  };

  const newTime = moment().format();

  let newPhase
  if (req.body.currPhase === 'body') {
    newPhase = 'legs'
  } else if (req.body.currPhase === 'legs') {
    newPhase = 'completed'
  };

  models.Mash.findByIdAndUpdate(req.params.id,{
    $set: {
      lastModified: newTime,
      phase: newPhase
    },
    $push: {
      users: mongoose.Types.ObjectId(req.userData.id),
      imageData: req.body.imageData
    }
  }, {new: true})
  .then(updatedMash => {
    res.status(201).send({
      message: "monster mash updated",
      updatedMash
    });
  })
  .catch(err => {
    next({status: 500, error: err})
  })
}