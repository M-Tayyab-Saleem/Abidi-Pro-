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

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

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
                  <img src="https://yourdomain.com/logo.png" alt="Abidi ProLogo" />
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
  if (!user) throw new NotFoundError("User not found");
  if (!user.otp || user.otpExpires < new Date())
    throw new BadRequestError("OTP expired");
  if (String(user.otp) !== String(otp))
    throw new BadRequestError("Invalid OTP");

  user.otp = null;
  user.otpExpires = null;
  user.refreshToken = generateRefreshToken(user);
  await user.save();

  const token = generateToken(user);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", user.refreshToken, { httpOnly: true });

  res.status(200).json({
    message: "OTP verified",
    token,
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
                    <img src="https://yourdomain.com/logo.png" alt="Abidi ProLogo" />
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
  console.log("resetToken", resetToken);

  const mailOptions = {
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Reset Password",
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
              <img src="https://yourdomain.com/logo.png" alt="Abidi Pro Logo" />
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

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new BadRequestError("No refresh token provided");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const user = await User.findOne({ _id: decoded.id, refreshToken });
  if (!user) throw new UnauthorizedError("Invalid token or user not found");

  const newToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("token", newToken, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

  res.status(200).json({ message: "Token refreshed", token: newToken });
};

//Logout route
exports.logout = async (req, res) => {
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

  const decoded = jwt.decode(token);

  if (!decoded) {
    throw new UnauthorizedError("Invalid token");
  }

  await User.findByIdAndUpdate(decoded.id, { refreshToken: null });

  const expiryDate = new Date(decoded.exp * 1000);
  await BlacklistedToken.create({ token, expiresAt: expiryDate });

  // Clear cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
