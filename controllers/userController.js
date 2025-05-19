const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create User
exports.createUser = catchAsync(async (req, res) => {
  const {
    name, email, timeZone, reportsTo, password, empID, role,
    phoneNumber, designation, department, branch, empType, joiningDate,
    about, salary, education, address, experience, DOB,
    maritalStatus, emergencyContact, addedby
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

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
    designation, // ObjectId ref
    department,  // ObjectId ref
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
    emergencyContact,
    addedby
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});


// Get All Users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get User by ID
exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) throw new NotFoundError("User");

  res.status(200).json(user);
});

// Update User
exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");

  // Only update allowed fields
  const allowedFields = [
    "name", "email", "timeZone", "reportsTo", "empID", "role",
    "phoneNumber", "designation", "department", "branch", "empType", "joiningDate",
    "about", "salary", "education", "address", "experience", "DOB",
    "maritalStatus", "emergencyContact", "addedby", "empStatus", "avalaibleLeaves"
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

// Delete User
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new NotFoundError("User");

  res.status(200).json({ message: "User deleted successfully" });
});
