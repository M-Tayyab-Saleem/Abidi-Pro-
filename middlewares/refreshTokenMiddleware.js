const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userSchema");

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-reset-token",
];

const refreshTokenMiddleware = catchAsync(async (req, res, next) => {
  const path = req.path.toLowerCase();

  // Skip auth for public paths
  if (PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath))) {
    return next();
  }

  const token =
    req.cookies.token ||
    (req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) return next(); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) throw new UnauthorizedError("User not found");

    req.user = user; 
    req.token = token;
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      throw new UnauthorizedError("Invalid token");
    }

    // Token expired: try to refresh
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError("Session expired, please login again");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!user) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.user = user; 
    req.token = newToken;
    return next();
  }
});

module.exports = refreshTokenMiddleware;
