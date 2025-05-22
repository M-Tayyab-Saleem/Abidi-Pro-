const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/ExpressError');
const { error } = require('../utils/logger');
const BlacklistedToken = require('../models/BlacklistedTokenSchema');


const isLoggedIn = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      error('No authentication token found');
      throw new UnauthorizedError('Please login first.');
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      throw new UnauthorizedError('Token is no longer valid. Please login again.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    error(`Auth Middleware Error: ${err.message}`);
    next(err);
  }
};

module.exports = { isLoggedIn };
