const Employee = require("../../models/UserManagment/UserSchema");

exports.getUserById = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id).select("-password");
    res.json({ success: true, data: user });
  } catch {
    res.status(404).json({ success: false, message: "User not found" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await Employee.findById(req.user._id).select("-password");
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json({ success: true, data: user });
  } catch {
    res.status(400).json({ success: false, message: "Update failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch {
    res.status(400).json({ success: false, message: "Delete failed" });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.department) query.department = req.query.department;

    const users = await Employee.find(query).select("-password");
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, message: "Failed to list users" });
  }
};
