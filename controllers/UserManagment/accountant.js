const Accountant = require("../../models/UserManagment/UserSchema");

// POST: Create Accountant
const postAccountant = async (req, res) => {
  try {
    const { name, email, contact, role, customId, accessLevel } = req.body;
    const accountant = new Accountant({
      name,
      email,
      contact,
      role,
      customId,
      accessLevel,
    });
    await accountant.save();
    res.status(200).json({ accountant });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: All Accountants
const getAccountant = async (req, res) => {
  try {
    const accountant = await Accountant.find({ role: "Accountant" }).sort({
      createdAt: -1,
    });
    res.status(200).json(accountant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving users", details: error.message });
  }
};

// GET: Specific Accountant by ID
const getAccountantById = async (req, res) => {
  const { id } = req.params;
  try {
    const accountant = await Accountant.findById(id);
    if (!accountant) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(accountant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving user", details: error.message });
  }
};

// PUT: Update Accountant
const updateAccountant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, role, customId, assignedTrip } = req.body;

    const accountant = await Accountant.findByIdAndUpdate(
      id,
      { name, email, contact, role, customId, assignedTrip },
      { new: true }
    );

    if (!accountant) {
      return res.status(404).json({ error: "Accountant not found" });
    }

    res.json(accountant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE: Delete Accountant
const removeAccountant = async (req, res) => {
  const { id } = req.params;
  try {
    const accountant = await Accountant.findByIdAndDelete(id);
    if (!accountant) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};

module.exports = {
  postAccountant,
  getAccountant,
  getAccountantById,
  updateAccountant,
  removeAccountant,
};
