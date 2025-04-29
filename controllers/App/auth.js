require("dotenv").config();
const User = require("../../models/UserManagment/UserSchema");
const jwt = require("jsonwebtoken");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");
const crypto = require('crypto');
const sendOtpOnWhatsApp = require("../../config/contactConfig");


const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Function to generate token
const generateToken = (user) => {
    return jwt.sign(
      {
        id: user._id,
        contact: user.contact,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  };

  function formatPakistaniNumber(contact) {
    contact = contact.replace(/\D/g, '');
  
    if (contact.startsWith('03') && contact.length === 11) {
      return '+92' + contact.slice(1);
    } else if (contact.startsWith('92') && contact.length === 12) {
      return '+' + contact;
    } else if (contact.startsWith('+92') && contact.length === 13) {
      return contact;
    } else {
      throw new Error('Invalid Pakistani contact number format.');
    }
  }
  
  // Create new user
  const createUser = async (req, res) => {
    let { contact, name } = req.body;
  
    if (!contact) {
      throw new BadRequestError("Phone number is required");
    }
  
    const newContact = formatPakistaniNumber(contact);

    let userExist = await User.findOne({ contact });

      if (userExist) {
        throw new BadRequestError("User already exists");
      }
  
      const user = new User({
        name,
        contact : newContact,
      });
  
    const otp = generateOTP();
    const currentTime = new Date();
    const otpExpires = new Date(currentTime.getTime() + 5 * 60 * 1000); // 5 min
  
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  
    await sendOtpOnWhatsApp(newContact, otp, name);
  
    const token = generateToken(user);
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  
    res.status(201).json({
      message: "OTP sent successfully to WhatsApp",
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
      },
      token,
    });
  };
  
  // Verify OTP
  const verifyOtp = async (req, res) => {
    const { contact, otp } = req.body;
  
    if (!contact || !otp) {
      throw new BadRequestError("Phone number and OTP are required");
    }
    const newContact = formatPakistaniNumber(contact);

    const user = await User.findOne({ contact: newContact });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  
    if (!user.otp || user.otpExpires < new Date()) {
      throw new BadRequestError("OTP expired. Please request a new one.");
    }
  
    if (user.otp.toString() !== otp.toString()) {
      throw new BadRequestError("Invalid OTP");
    }
  
    user.otp = null;
    user.otpExpires = null;
    await user.save();
  
    const token = generateToken(user);
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  
    res.status(200).json({
      message: "OTP verified successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        contact: user.contact,
      },
    });
  };
  
  // Resend OTP
  const resendOtp = async (req, res) => {
    const { contact } = req.body;
  
    if (!contact) {
      throw new BadRequestError("Phone number is required");
    }
    const newContact = formatPakistaniNumber(contact);
    const user = await User.findOne({ contact: newContact });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  
    const otp = generateOTP();
    const currentTime = new Date();
    const otpExpires = new Date(currentTime.getTime() + 5 * 60 * 1000);
  
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  
    await sendOtpOnWhatsApp(newContact, otp, user.name);
  
    res.status(200).json({
      message: "New OTP sent successfully to WhatsApp",
    });
  };
  
  module.exports = {
    createUser,
    verifyOtp,
    resendOtp,
  };