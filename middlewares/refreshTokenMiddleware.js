// const jwt = require('jsonwebtoken');
// const User = require('../models/userSchema');
// const { UnauthorizedError } = require('../utils/ExpressError');
// const catchAsync = require('../utils/catchAsync');

// const refreshTokenMiddleware = catchAsync(async (req, res, next) => {
 
//   if (req.path === '/signin' || 
//       req.path === '/signup' || 
//       req.path === '/refresh-token' ||
//       req.path === '/verify-otp' ||
//       req.path === '/resend-otp') {
//     return next();
//   }

//   const token = req.cookies.token || 
//                (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  
//   if (!token) {
//     return next();
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     return next();
//   } catch (err) {
//     if (err.name !== 'TokenExpiredError') {
//       throw new UnauthorizedError('Invalid token');
//     }

   
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       throw new UnauthorizedError('Session expired, please login again');
//     }

//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findOne({ 
//       _id: decoded.id,
//       refreshToken 
//     });

//     if (!user) {
//       throw new UnauthorizedError('Invalid refresh token');
//     }


//     const newToken = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     const newRefreshToken = jwt.sign(
//       { id: user._id },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
//     );

   
//     user.refreshToken = newRefreshToken;
//     await user.save();

 
//     res.cookie("token", newToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

 
//     req.token = newToken;
//     req.user = user;

//     return next();
//   }
// });

// module.exports = refreshTokenMiddleware;