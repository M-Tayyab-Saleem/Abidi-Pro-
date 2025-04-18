const jwt = require('jsonwebtoken');
const User = require('../models/UserManagment/UserSchema');
const { UnauthorizedError } = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const refreshTokenMiddleware = catchAsync(async (req, res, next) => {
  // Skip middleware for auth routes
  if (req.path === '/signin' || 
      req.path === '/signup' || 
      req.path === '/refresh-token' ||
      req.path === '/verify-otp' ||
      req.path === '/resend-otp') {
    return next();
  }

  const token = req.cookies.token || 
               (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  // If no token, proceed (other middleware will handle auth)
  if (!token) {
    return next();
  }

  try {
    // Verify access token
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      throw new UnauthorizedError('Invalid token');
    }

    // Token expired, try to refresh
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Session expired, please login again');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ 
      _id: decoded.id,
      refreshToken 
    });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Attach new token to request
    req.token = newToken;
    req.user = user;

    return next();
  }
});

module.exports = refreshTokenMiddleware;