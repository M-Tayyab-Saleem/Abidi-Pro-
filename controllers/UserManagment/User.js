const User = require("../../models/UserManagment/UserSchema");
const { BadRequestError, NotFoundError } = require("../../utils/ExpressError");

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

// Get current user profile
const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id, "-password -otp -otpExpires");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      customId: user.customId,
      createdAt: user.createdAt,
    },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser
};
