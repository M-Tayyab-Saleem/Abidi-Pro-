const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const htmlToText = require("html-to-text");
require("dotenv").config();
const bcrypt = require("bcryptjs");

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * Send email with EJS template support
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - EJS template name (without extension)
 * @param {Object} options.context - Data to pass to template
 * @returns {Promise} Promise that resolves when email is sent
 */
const sendEmail = async ({ to, subject, template, context }) => {
  try {
    // Render HTML template
    const html = await ejs.renderFile(
      path.join(__dirname, `../views/emails/${template}.ejs`),
      context
    );

    // Create mail options
    const mailOptions = {
      from: `"Abidi Pro" <${process.env.GMAIL}>`,
      to,
      subject,
      html,
      text: htmlToText.htmlToText(html)
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send OTP email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.otp - The OTP code
 * @param {string} options.name - Recipient name
 */
const sendOTPEmail = async ({ to, otp, name }) => {
  try {
    await sendEmail({
      to,
      subject: 'Your OTP Verification - Abidi Pro',
      template: 'otpEmail',
      context: {
        name: name || 'there',
        otp
      }
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

/**
 * Send Forgot Password email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient's name
 * @param {string} options.resetURL - Password reset URL
 */
const sendForgotPasswordEmail = async ({ to, name, resetURL }) => {
  try {
    await sendEmail({
      to,
      subject: "Password Reset Request - Abidi Pro",
      template: "forgotPasswordEmail",
      context: {
        name: name || "Abidi Pro user",
        resetURL
      }
    });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw error;
  }
};

/**
 * Send account invitation email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.role - User role
 * @param {string} options.activationURL - Activation URL
 */
const sendInvitationEmail = async ({ to, name, role, activationURL }) => {
  try {
    await sendEmail({
      to,
      subject: `You've been invited to join Abidi Pro as ${role}`,
      template: 'invitationEmail',
      context: {
        name: name || 'New User',
        role,
        activationURL
      }
    });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendForgotPasswordEmail,
  sendInvitationEmail
};