require("dotenv").config();
const User = require("../../models/UserManagment/UserSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { info, warn, error, debug } = require("../../utils/logger");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../../models/UserManagment/BlacklistedTokenSchema");
const crypto = require('crypto');


// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < minLength) {
    throw new BadRequestError(
      `Password must be at least ${minLength} characters long.`
    );
  }
  if (!passwordRegex.test(password)) {
    throw new BadRequestError(
      "Password must contain at least one letter, one number, and one special character."
    );
  }
};

// Function to generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Function to generate a random reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};


// Create a new user
const createUser = async (req, res) => {
  const { email, name, password, role } = req.body;

  validatePassword(password);
  const hashpassword = bcrypt.hashSync(password);

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError("User already exists");
  }
;
  let prefix = "";
  if (role === "admin" || role === "Admin") {
    prefix = "RideAD";
  } else if (role === "accountant" || role === "Accountant") {
    prefix = "RideAC";
  } else if (role === "dispatcher" || role === "Dispatcher") {
    prefix = "RideD";
  }

  let customId = "";
  if (prefix) {
    const count = await User.countDocuments({ role });
    const nextNumber = count + 1;
    const paddedNumber = String(nextNumber).padStart(3, "0");
    customId = prefix + paddedNumber;
  }

  const user = new User({
    name,
    email,
    password: hashpassword,
    role,
    customId,
  });
  await user.save();

  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });


  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      customId: user.customId,
    },
    token,
  });
};

// Signin route
const signIn = async (req, res) => {
  const { email, password } = req.body;

  info(`Signin request received for email: ${email}`);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    error(`Login failed for ${email}: Please Sign Up first!`);
    throw new BadRequestError("You are not registered. Please Sign Up first!");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    error(`Invalid password attempt for ${email}`);
    throw new BadRequestError("Invalid Password");
  }

  info(`User ${email} successfully logged in.`);

  const currentTime = new Date();
  const otp = generateOTP();
  const otpExpires = new Date(currentTime.getTime() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpGeneratedAt = currentTime;
  user.otpExpires = otpExpires;
  debug(
    `OTP generated for ${email}: ${otp} (expires at ${otpExpires.toISOString()})`
  );
  await user.save();

  info(`OTP successfully generated for ${email}. Sending OTP...`);

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your OTP for Via Ride",
    html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-sizing: border-box;
              }
              .header {
                text-align: center;
                padding: 10px;
                border-bottom: 2px solid #f1f1f1;
              }
              .header img {
                max-width: 150px;
                height: auto;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                background-color: #e0f7e0;
                padding: 15px;
                border-radius: 5px;
              }
              .cta {
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 30px;
              }
              .footer p {
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <img src="https://yourdomain.com/logo.png" alt="Via Ride Logo" />
              </div>
              <div class="content">
                <h2>Welcome to Via Ride!</h2>
                <p>We are excited to help you with your journey. To complete your login, please use the following OTP (One-Time Password) to verify your account:</p>
                <div class="otp">${otp}</div>
                <p>This OTP will expire in 5 minute. Please enter it promptly to continue.</p>
                <a href="https://yourdomain.com" class="cta">Go to Via Ride</a>
              </div>
              <div class="footer">
                <p>If you did not request this OTP, please ignore this email or contact support.</p>
                <p>Via Ride, Inc. | All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
  };

  transporter.sendMail(mailOptions, (mailError) => {
    if (mailError) {
      error(`Error sending OTP to ${email}: ${mailError.message}`);
      throw new Error("Error sending OTP email");
    }
  });

  res.status(200).json({
    message: "OTP sent to your email",
    email: user.email,
    name: user.name,
    id: user._id,
    role: user.role,
    otpGeneratedAt: currentTime.toISOString(),
    otpExpiresAt: otpExpires.toISOString(),
  });
};

// Verify OTP route
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    error(`OTP verification failed for ${email}: User not found`);
    throw new NotFoundError("User");
  }

  if (!user.otp || user.otpExpires < new Date()) {
    error(`OTP expired for ${email}`);
    throw new BadRequestError("OTP expired. Please request a new one.");
  }

  if (user.otp !== otp) {
    error(`Invalid OTP attempt for ${email}`);
    throw new BadRequestError("Invalid OTP");
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  // Generate token
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  info(`OTP verified successfully for ${email}`);
  res.status(200).json({
    message: "OTP verified successfully!",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      customId: user.customId,
    },
  });
};

// Resend OTP route
const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    error(`Resend OTP failed for ${email}: User not found`);
    throw new NotFoundError("User");
  }

  const otp = generateOTP();
  const currentTime = new Date();
  const otpExpires = new Date(currentTime.getTime() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  info(`New OTP sent to ${email}`);

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your OTP",
    html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-sizing: border-box;
              }
              .header {
                text-align: center;
                padding: 10px;
                border-bottom: 2px solid #f1f1f1;
              }
              .header img {
                max-width: 150px;
                height: auto;
              }
              .content {
                padding: 20px;
                text-align: center;
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                background-color: #e0f7e0;
                padding: 15px;
                border-radius: 5px;
              }
              .cta {
                background-color: #4CAF50;
                color: white;
                padding: 15px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                border-radius: 5px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 30px;
              }
              .footer p {
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <img src="https://yourdomain.com/logo.png" alt="Via Ride Logo" />
              </div>
              <div class="content">
                <h2>Welcome to Via Ride!</h2>
                <p>We are excited to help you with your journey. To complete your login, please use the following OTP (One-Time Password) to verify your account:</p>
                <div class="otp">${otp}</div>
                <p>This OTP will expire in 5 minute. Please enter it promptly to continue.</p>
                <a href="https://yourdomain.com" class="cta">Go to Via Ride</a>
              </div>
              <div class="footer">
                <p>If you did not request this OTP, please ignore this email or contact support.</p>
                <p>Via Ride, Inc. | All rights reserved.</p>
              </div>
            </div>
          </body>
        </html> `,
  };

  transporter.sendMail(mailOptions, (mailError) => {
    if (mailError) {
      error(`Error sending OTP to ${email}: ${mailError.message}`);
      throw new Error("Error sending OTP email");
    }
  });

  res.status(200).json({ message: "New OTP sent to your email" });
};

//Logout route
const logout = async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthorizedError("No token provided for logout");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  await User.findByIdAndUpdate(decoded.id, { refreshToken: null });

  const expiryDate = new Date(decoded.exp * 1000);
  await BlacklistedToken.create({ token, expiresAt: expiryDate });

  // Clear cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};


// Forgot password functionality
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  info(`Password reset request received for email: ${email}`);
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("No user found with that email address");
  }
  
  // Generate reset token
  const resetToken = generateResetToken();
  
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  
  // Create reset URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  // Send email with reset link
  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your Password Reset Link (Valid for 10 min)",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              padding: 10px;
              border-bottom: 2px solid #f1f1f1;
            }
            .header img {
              max-width: 150px;
              height: auto;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .reset-button {
              background-color: #4CAF50;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
              margin-top: 30px;
            }
            .footer p {
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="https://yourdomain.com/logo.png" alt="Via Ride Logo" />
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password. Click the button below to set a new password:</p>
              <a href="${resetURL}" class="reset-button">Reset Password</a>
              <p>If you did not request a password reset, please ignore this email or contact support if you're concerned.</p>
              <p>This link will expire in 10 minutes for security reasons.</p>
            </div>
            <div class="footer">
              <p>Via Ride, Inc. | All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    info(`Reset password email sent to ${email}`);
    
    res.status(200).json({
      message: "Password reset link sent to your email"
    });
  } catch (mailError) {
    error(`Error sending reset email to ${email}: ${mailError.message}`);
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    throw new Error("Error sending password reset email");
  }
};

// Verify reset token validity
const verifyResetToken = async (req, res) => {
  const { token } = req.params;
  
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new BadRequestError("Token is invalid or has expired");
  }
  
  res.status(200).json({
    message: "Token is valid",
    email: user.email
  });
};

// Reset password with token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
    
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new BadRequestError("Token is invalid or has expired");
  }
  
  // Update password
  user.password = bcrypt.hashSync(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  // Generate new token
  const newToken = generateToken(user);
  
  res.status(200).json({
    message: "Password reset successful",
    token: newToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      customId: user.customId
    }
  });
};

// Generate refresh token
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    throw new BadRequestError("No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  // Find user with this refresh token
  const user = await User.findOne({ 
    _id: decoded.id,
    refreshToken 
  });

  if (!user) {
    throw new UnauthorizedError("User not found or refresh token invalid");
  }

  const newToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    message: "Token refreshed successfully",
    token: newToken,
    refreshToken: newRefreshToken
  });
};

module.exports = {
  createUser,
  signIn,
  verifyOtp,
  resendOtp,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  refreshToken,
};
