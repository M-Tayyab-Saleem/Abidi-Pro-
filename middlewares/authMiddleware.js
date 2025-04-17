const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/ExpressError');
const { error } = require('../utils/logger');
const BlacklistedToken = require('../models/UserManagment/BlacklistedTokenSchema'); 


const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization?.split(' ')[1];
    }

    // If not found in header, check for token in cookies
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If still no token, throw unauthorized
    if (!token) {
      error('No authentication token found');
      throw new UnauthorizedError('Please login First.');
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