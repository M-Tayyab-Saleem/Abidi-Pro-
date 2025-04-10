const User = require("../../models/UserManagment/UserSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { info, warn, error, debug } = require("../../utils/logger"); // Import your logger utilityconst generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "syedmunawarali906@gmail.com",
    pass: "tsdo zpys wyoc lykh",
  },
});

// Regular expression for password validation
const validatePassword = (password) => {
  const minLength = 8; // Minimum password length
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Check if the password is at least 8 characters long and meets the criteria
  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long.`,
    };
  }
  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one letter, one number, and one special character.",
    };
  }
  return { valid: true };
};


//Create a new user
const createUser =  async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    // Validate the password
    const { valid, message } = validatePassword(password);
    if (!valid) {
      return res.status(400).json({ message });
    }
    const hashpassword = bcrypt.hashSync(password);
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    let prefix = "";
    if (role === "Admin") {
      prefix = "RideAD";
    } else if (role === "Accountant") {
      prefix = "RideAC";
    } else if (role === "Dispatcher") {
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
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers =  async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving users", details: error.message });
  }
};

//get Specific user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving user", details: error.message });
  }
};

// Update user 
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating user", details: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Trying to delete user with id: ${id}`);
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`User deleted successfully: ${user}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};


// Signin route
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log incoming signin request
    info(`Signin request received for email: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const errorMsg = "Please Sign Up first!";
      // Log login failure
      error(`Login failed for ${email}: ${errorMsg}`);
      return res.status(400).json({ message: errorMsg });
    }

    // Compare password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      const errorMsg = "Invalid Password";
      // Log invalid password attempt
      error(`Invalid password attempt for ${email}`);
      return res.status(400).json({ message: errorMsg });
    }

    // Log successful login
    info(`User ${email} successfully logged in.`);

    // Generate OTP
    const currentTime = new Date();
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000); // OTP expires in 1 minute
    user.otp = otp;
    user.otpGeneratedAt = currentTime;
    user.otpExpires = otpExpires;

    // Log OTP generation
    debug(
      `OTP generated for ${email}: ${otp} (expires at ${otpExpires.toISOString()})`
    );

    await user.save();

    // Log OTP generated but not sent yet
    info(`OTP successfully generated for ${email}. Sending OTP...`);

    const mailOptions = {
      from: 'no-reply@yourdomain.com', // Your email
      to: user.email,
      subject: 'Your OTP for Via Ride',
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
        </html>
      `
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      }
      console.log("Email sent: " + info.response);
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
  } catch (error) {
    console.error("Signin Error:", error.message);
    // Log signin error
    error(`Signin error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

// Verify OTP route
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Log the failed verification attempt
      error(`OTP verification failed for ${email}: User not found`);
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.otp || user.otpExpires < new Date()) {
      // Log OTP expiry
      error(`OTP expired for ${email}`);
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      // Log invalid OTP attempt
      error(`Invalid OTP attempt for ${email}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Log successful OTP verification
    info(`OTP verified successfully for ${email}`);
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    // Log error during OTP verification
    error(
      `Server error during OTP verification for ${email}: ${error.message}`
    );
    res.status(500).json({ message: "Server Error" });
  }
};

// Resend OTP route
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Log the failed resend attempt
      error(`Resend OTP failed for ${email}: User not found`);
      return res.status(400).json({ message: "User not found" });
    }

    // Remove old OTP and generate a new one
    const otp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();
    const otpExpires = new Date(currentTime.getTime() + 1 * 60 * 1000); // OTP expires in 1 minute

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Log OTP resend success
    info(`New OTP sent to ${email}`);

    // Send OTP via email (use your transporter or mailer logic here)
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
        </html>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Error sending OTP email" });
      }
      console.log("Email sent: " + info.response);
    });

    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);
    error(`Error resending OTP for ${email}: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
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
