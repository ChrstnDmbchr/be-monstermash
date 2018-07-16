const jwt = require('jsonwebtoken')
const tokenSecret = process.env.MONGODB_URI ? process.env.TOKEN_SECRET : require('../config').tokenSecret;

module.exports = (req, res, next) => {
  try { 
    const token = req.headers.authorisation.split(' ')[1]
    const decoded = jwt.verify(token, tokenSecret);
    req.userData = decoded;
    next();
  } catch (err) {
    return next({ status: 401, error: 'auth failed' })
  };
};