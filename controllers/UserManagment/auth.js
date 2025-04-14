require('dotenv').config();
const User = require("../../models/UserManagment/UserSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { info, warn, error, debug } = require("../../utils/logger");
const { BadRequestError, NotFoundError } = require('../../utils/ExpressError');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const validatePassword = (password) => {
  const minLength = 8;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (password.length < minLength) {
    throw new BadRequestError(`Password must be at least ${minLength} characters long.`);
  }
  if (!passwordRegex.test(password)) {
    throw new BadRequestError("Password must contain at least one letter, one number, and one special character.");
  }
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

  let prefix = "";
  if (role === "Admin" || role === "admin") {
    prefix = "RideAD";
  } else if (role === "Accountant" || role === "accountant") {
    prefix = "RideAC";
  } else if (role === "Dispatcher" || role === "dispatcher") {
    prefix = "RideD";
  }

  let customId = "";
  if (prefix) {
    const count = await User.countDocuments({ role });
    const nextNumber = count + 1;
    const paddedNumber = String(nextNumber).padStart(3, "0");
    customId = prefix + paddedNumber;
  }

  const userRole = role.toLowerCase();
  const user = new User({
    name,
    email,
    password: hashpassword,
    role: userRole,
    customId,
  });

  await user.save();
  res.status(200).json({ user });
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

// Get specific user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User");
  }
  res.status(200).json(user);
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  await user.save();

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new NotFoundError("User");
  }
  res.status(200).json({ message: "User deleted successfully" });
};

// Signin route
const signIn = async (req, res) => {
  const { email, password } = req.body;

  info(`Signin request received for email: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    error(`Login failed for ${email}: Please Sign Up first!`);
    throw new BadRequestError("Please Sign Up first!");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    error(`Invalid password attempt for ${email}`);
    throw new BadRequestError("Invalid Password");
  }

  info(`User ${email} successfully logged in.`);

  const currentTime = new Date();
  const otp = generateOTP();
  const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000);

  user.otp = otp;
  user.otpGeneratedAt = currentTime;
  user.otpExpires = otpExpires;
  debug(`OTP generated for ${email}: ${otp} (expires at ${otpExpires.toISOString()})`);
  await user.save();

  info(`OTP successfully generated for ${email}. Sending OTP...`);

  const mailOptions = {
    from: 'no-reply@yourdomain.com',
    to: user.email,
    subject: 'Your OTP for Via Ride',
    html:`
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
                <p>This OTP will expire in 1 minute. Please enter it promptly to continue.</p>
                <a href="https://yourdomain.com" class="cta">Go to Via Ride</a>
              </div>
              <div class="footer">
                <p>If you did not request this OTP, please ignore this email or contact support.</p>
                <p>Via Ride, Inc. | All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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

  info(`OTP verified successfully for ${email}`);
  res.status(200).json({ message: "OTP verified successfully!" });
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
  const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000);

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
                <p>This OTP will expire in 1 minute. Please enter it promptly to continue.</p>
                <a href="https://yourdomain.com" class="cta">Go to Via Ride</a>
              </div>
              <div class="footer">
                <p>If you did not request this OTP, please ignore this email or contact support.</p>
                <p>Via Ride, Inc. | All rights reserved.</p>
              </div>
            </div>
          </body>
        </html> `
  };

  transporter.sendMail(mailOptions, (mailError) => {
    if (mailError) {
      error(`Error sending OTP to ${email}: ${mailError.message}`);
      throw new Error("Error sending OTP email");
    }
  });

  res.status(200).json({ message: "New OTP sent to your email" });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signIn,
  verifyOtp,
  resendOtp,
};