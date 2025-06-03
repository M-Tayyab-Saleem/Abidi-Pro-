const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/ExpressError');
const BlacklistedToken = require('../models/BlacklistedTokenSchema');
const User = require('../models/userSchema');

const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Please login first."));
  }

  const token = authHeader.split(" ")[1];

  const isBlacklisted = await BlacklistedToken.findOne({ token });
  if (isBlacklisted) {
    return next(new UnauthorizedError("Access token has been revoked"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("name email role");
    if (!user) {
      return next(new UnauthorizedError("User not found."));
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.token = token;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired access token"));
  }
};

module.exports = { isLoggedIn };
