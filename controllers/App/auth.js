require("dotenv").config();
const User = require("../../models/UserManagment/UserSchema");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");
const sendOtpOnWhatsApp = require("../../config/contactConfig");

const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, contact: user.contact },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

function formatPakistaniNumber(contact) {
  contact = contact.replace(/\D/g, "");

  if (contact.startsWith("03") && contact.length === 11) {
    return "+92" + contact.slice(1);
  } else if (contact.startsWith("92") && contact.length === 12) {
    return "+" + contact;
  } else if (contact.startsWith("+92") && contact.length === 13) {
    return contact;
  } else {
    throw new Error("Invalid Pakistani contact number format.");
  }
}

// Create new user
const createUser = async (req, res) => {
  let { contact, name } = req.body;

  if (!contact) {
    throw new BadRequestError("Phone number is required");
  }

  const newContact = formatPakistaniNumber(contact);

  let userExist = await User.findOne({ contact: newContact });
  if (userExist) {
    throw new BadRequestError("User already exists");
  }

  const user = new User({
    name,
    contact: newContact,
  });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpOnWhatsApp(newContact, otp, name);

  res.status(201).json({
    message: "OTP sent successfully to WhatsApp",
    user: {
      id: user._id,
      name: user.name,
      contact: user.contact,
    },
  });
};

const verifyOtp = async (req, res) => {
  const { contact, otp } = req.body;

  if (!contact || !otp)
    throw new BadRequestError("Phone number and OTP are required");

  const newContact = formatPakistaniNumber(contact);
  const user = await User.findOne({ contact: newContact });

  if (!user) throw new NotFoundError("User not found");
  if (!user.otp || user.otpExpires < new Date())
    throw new BadRequestError("OTP expired");
  if (user.otp.toString() !== otp.toString())
    throw new BadRequestError("Invalid OTP");

  user.otp = null;
  user.otpExpires = null;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;

  await user.save();

  res.status(200).json({
    message: "OTP verified successfully!",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      contact: user.contact,
    },
  });
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) throw new BadRequestError("Refresh token required");

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new BadRequestError("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    throw new BadRequestError("Refresh token expired or invalid");
  }
};



const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new NotFoundError("User not found");

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      contact: user.contact,
    },
  });
};



const resendOtp = async (req, res) => {
  const { contact } = req.body;

  if (!contact) throw new BadRequestError("Phone number is required");

  const newContact = formatPakistaniNumber(contact);
  const user = await User.findOne({ contact: newContact });

  if (!user) throw new NotFoundError("User not found");

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpOnWhatsApp(newContact, otp, user.name);

  res.status(200).json({ message: "New OTP sent successfully to WhatsApp" });
};

const logout = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new NotFoundError("User not found");

  user.refreshToken = null;
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  createUser,
  verifyOtp,
  refreshToken,
  getCurrentUser,
  resendOtp,
  logout,
};
