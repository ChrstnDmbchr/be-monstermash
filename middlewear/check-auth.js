const jwt = require('jsonwebtoken')
const tokenSecret = require('../config').tokenSecret;

module.exports = (req, res, next) => {
  try { 
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, tokenSecret);
    req.userData = decoded;
    next();
  } catch (err) {
    return next({ status: 401, error: 'auth failed' })
  };
};