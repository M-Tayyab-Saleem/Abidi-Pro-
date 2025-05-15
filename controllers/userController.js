const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create User
exports.createUser = async (req, res) => {
  const {
  name, email, timeZone, reportsTo, password, empID, role,
  phoneNumber, designation, department, branch, empType, joiningDate,
  about, salary, education, address, experience, DOB,
  maritalStatus, emergencyContact
} = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
      console.log("User already exists")
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      timeZone,
      reportsTo,
      password: hashedPassword,
      empID,
      role,
      phoneNumber,
      designation,
      department,
      branch,
      empType,
      joiningDate,
      about,
      salary,
      education, 
      address, 
      experience, 
      DOB,
      maritalStatus, 
      emergencyContact
      });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
const {
  name, email, timeZone, reportsTo, password, empID, role,
  phoneNumber, designation, department, branch, empType, joiningDate,
  about, salary, education, address, experience, DOB,
  maritalStatus, emergencyContact
} = req.body;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 12); 
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.timeZone = timeZone || user.timeZone;
    user.reportsTo = reportsTo || user.reportsTo;
    user.empID = empID || user.empID;
    user.role = role || user.role;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.designation = designation || user.designation;
    user.department = department || user.department;
    user.branch = branch || user.branch;
    user.empType = empType || user.empType;
    user.joiningDate = joiningDate || user.joiningDate;

    user.about = about || user.about;
    user.salary = salary || user.salary;
    user.education = education || user.education;
    user.address = address || user.address;
    user.experience = experience || user.experience;
    user.DOB = DOB || user.DOB;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.emergencyContact = emergencyContact || user.emergencyContact;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  console.log("Login attempt:", { email });

  try {
    if (!email || !password) {
      console.warn("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.warn(`No user found with email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("Incorrect password attempt");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    console.log(`User ${email} logged in successfully`);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
