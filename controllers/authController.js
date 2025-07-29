require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/userSchema");
const { info, error, debug } = require("../utils/logger");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/ExpressError");
const BlacklistedToken = require("../models/BlacklistedTokenSchema");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Utility functions
const generateToken = require("../utils/token").generateAccessToken;
const generateRefreshToken = require("../utils/token").generateRefreshToken;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// 1. Login 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  info(`Login request received for email: ${email}`);
  const user = await User.findOne({ email }).select("+password");
  if (!user)
    throw new BadRequestError("You are not registered. Please sign up first.");

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) throw new BadRequestError("Invalid password");

  const otp = generateOTP();
  const currentTime = new Date();
  user.otp = otp;
  user.otpGeneratedAt = currentTime;
  user.otpExpires = new Date(currentTime.getTime() + 5 * 60 * 1000);
  await user.save();

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Your OTP for Via Ride",
    html: `
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #6c5ce7;
      padding: 25px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    h2 {
      color: #6c5ce7;
      margin-top: 0;
    }
    .otp-container {
      margin: 25px 0;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #6c5ce7;
      background-color: #f3f1ff;
      padding: 20px;
      border-radius: 8px;
      display: inline-block;
      margin: 15px 0;
      border: 1px dashed #6c5ce7;
    }
    .cta {
      background-color: #6c5ce7;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
      border-radius: 50px;
      margin: 20px 0;
      transition: all 0.3s ease;
    }
    .cta:hover {
      background-color: #5649c0;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(108, 92, 231, 0.3);
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      padding: 20px;
      background-color: #f8f9fa;
      border-top: 1px solid #eee;
    }
    .footer p {
      margin: 5px 0;
    }
    .highlight {
      color: #6c5ce7;
      font-weight: bold;
    }
    .expiry-note {
      font-size: 14px;
      color: #e74c3c;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://yourdomain.com/logo.png" alt="Abidi Pro Logo" />
    </div>
    <div class="content">
      <h2>Your Abidi Pro Verification Code</h2>
      <p>Hello there!</p>
      <p>Thank you for choosing <span class="highlight">Abidi Pro</span>. To complete your login, please use the following verification code:</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
      </div>
      
      <p class="expiry-note">This code will expire in 5 minutes</p>
      <p>For your security, please don't share this code with anyone.</p>
      
      
      <p style="font-size: 14px; margin-top: 30px;">
        Didn't request this code?<br>
        Please ignore this email or <a href="mailto:" style="color: #6c5ce7;">contact our support team</a>.
      </p>
    </div>
    <div class="footer">
      <p>© 2023 Abidi Pro. All rights reserved.</p>
      <p>123 Business Ave, Suite 456, Tech City, TC 10001</p>
      <p>
        <a href="#" style="color: #6c5ce7; text-decoration: none;">Privacy Policy</a> | 
        <a href="#" style="color: #6c5ce7; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "OTP sent to your email",
    email: user.email,
    name: user.name,
    id: user._id,
    role: user.role,
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp || user.otpExpires < Date.now())
    throw new BadRequestError("Invalid or expired OTP");
  if (String(user.otp) !== String(otp)) throw new BadRequestError("Invalid OTP");

  user.otp = undefined;
  user.otpGeneratedAt = undefined;
  user.otpExpires = undefined;

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "OTP verified",
    token: accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("User not found");

  const otp = generateOTP();
  const now = new Date();
  user.otp = otp;
  user.otpGeneratedAt = now;
  user.otpExpires = new Date(now.getTime() + 5 * 60 * 1000);
  await user.save();

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Resent OTP",
    html: `<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #6c5ce7, #4b3ac2);
      padding: 25px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    h2 {
      color: #6c5ce7;
      margin-top: 0;
      font-size: 24px;
    }
    .otp-container {
      margin: 25px 0;
    }
    .otp {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #6c5ce7;
      background-color: #f3f1ff;
      padding: 20px 30px;
      border-radius: 10px;
      display: inline-block;
      margin: 20px 0;
      border: 2px solid #e0dcff;
      box-shadow: 0 4px 10px rgba(108, 92, 231, 0.1);
    }
    .cta {
      background: linear-gradient(to right, #6c5ce7, #4b3ac2);
      color: white;
      padding: 15px 32px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
      border-radius: 50px;
      margin: 25px 0;
      transition: all 0.3s ease;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
    }
    .cta:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      padding: 20px;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
    }
    .footer p {
      margin: 8px 0;
    }
    .highlight {
      color: #6c5ce7;
      font-weight: bold;
    }
    .expiry-note {
      font-size: 14px;
      color: #e74c3c;
      font-weight: bold;
      margin: 15px 0;
    }
    .security-note {
      font-size: 13px;
      color: #666;
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://abidipro.com/logo.png" alt="Abidi Pro Logo" />
    </div>
    <div class="content">
      <h2>Your Abidi Pro Verification Code</h2>
      <p>Hello valued user,</p>
      <p>Thank you for using <span class="highlight">Abidi Pro</span>. To authenticate your account, please use the following one-time verification code:</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
      </div>
      
      <p class="expiry-note">⚠️ Expires in 5 minutes</p>
      
      <a href="https://abidipro.com/login" class="cta">Continue to Abidi Pro</a>
      
      <div class="security-note">
        <p>For your security, never share this code with anyone.</p>
        <p>If you didn't request this, please <a href="mailto:support@abidipro.com" style="color: #6c5ce7;">contact our support team</a> immediately.</p>
      </div>
    </div>
    <div class="footer">
      <p>© 2023 Abidi Pro. All rights reserved.</p>
      <p>123 Innovation Drive, Tech City, TC 10101</p>
      <p>
        <a href="https://abidipro.com/privacy" style="color: #6c5ce7; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="https://abidipro.com/terms" style="color: #6c5ce7; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "New OTP sent to your email",
    email: user.email,
    name: user.name,
    id: user._id,
    role: user.role,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("No user found with that email");

  const resetToken = generateResetToken();
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Reset Password",
    html: `
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #6c5ce7;
      padding: 25px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    h2 {
      color: #6c5ce7;
      margin-top: 0;
    }
    .reset-button {
      background-color: #6c5ce7;
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
      border-radius: 50px;
      margin: 25px 0;
      transition: all 0.3s ease;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
    }
    .reset-button:hover {
      background-color: #5649c0;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      padding: 20px;
      background-color: #f8f9fa;
      border-top: 1px solid #eee;
    }
    .footer p {
      margin: 5px 0;
    }
    .highlight {
      color: #6c5ce7;
      font-weight: bold;
    }
    .expiry-note {
      font-size: 14px;
      color: #e74c3c;
      font-weight: bold;
      margin: 15px 0;
    }
    .security-note {
      font-size: 13px;
      color: #666;
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://abidipro.com/logo.png" alt="Abidi Pro Logo" />
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hello Abidi Pro user,</p>
      <p>We received a request to reset your password for your <span class="highlight">Abidi Pro</span> account. Click the button below to set a new password:</p>
      
      <a href="${resetURL}" class="reset-button">Reset Password</a>
      
      <p class="expiry-note">This link will expire in 10 minutes</p>
      
      <div class="security-note">
        <p>If you didn't request this password reset, please ignore this email or <a href="mailto:support@abidipro.com" style="color: #6c5ce7;">contact our support team</a> if you have concerns.</p>
      </div>
    </div>
    <div class="footer">
      <p>© 2023 Abidi Pro. All rights reserved.</p>
      <p>123 Business Ave, Suite 456, Tech City, TC 10001</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/auth/login" style="color: #6c5ce7; text-decoration: none;">Privacy Policy</a> | 
        <a href="${process.env.FRONTEND_URL}/auth/login" style="color: #6c5ce7; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "Password reset link sent to your email",
    email: user.email,
    name: user.name,
    id: user._id,
  });
};

// 2. Verify Reset Token
exports.verifyResetToken = async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError("Token is invalid or expired");

  res.status(200).json({ message: "Token is valid", email: user.email });
};

// 3. Reset Password with token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError("Token is invalid or expired");

  user.password = bcrypt.hashSync(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const newToken = generateToken(user);

  res.status(200).json({
    message: "Password reset successful",
    token: newToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};


//Logout route
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

  // Find user by refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) throw new UnauthorizedError("Invalid refresh token");

  // Blacklist refresh token
  await BlacklistedToken.create({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Blacklist access token if present
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (accessToken) {
    await BlacklistedToken.create({
      token: accessToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
  }

  // Clear refresh token on user model
  user.refreshToken = null;
  await user.save();

  // Clear cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};


exports.getCurrentUser = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const user = await User.findById(req.user.id);

  res.status(200).json({
    message: "Authenticated",
    user,
  });
};


exports.refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  if (!user) throw new UnauthorizedError("User not found");

  const accessToken = generateToken(user); // Use the correct function
  return res.status(200).json({ accessToken, user });
};