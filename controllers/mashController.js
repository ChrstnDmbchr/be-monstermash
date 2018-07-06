const models = require('../models');

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
  res.status(200).send({
    message: "Get oldest route working"
  })
}

exports.postContinueMash = (req, res, next) => {
  res.status(200).send({
    message: "post continue route working"
  })
}