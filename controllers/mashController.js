const models = require('../models');

exports.getAll = (req, res, next) => {
  res.status(200).send({
    message: "Get all route working"
  })
}

exports.getByID = (req, res, next) => {
  res.status(200).send({
    message: `Get by id ${req.params.mashid} route working`
  })
}

exports.getOldest = (req, res, next) => {
  res.status(200).send({
    message: "Get oldest route working"
  })
}

exports.postNewMash = (req, res, next) => {
  res.status(200).send({
    message: "post new route working"
  })
}

exports.postContinueMash = (req, res, next) => {
  res.status(200).send({
    message: "post continue route working"
  })
}