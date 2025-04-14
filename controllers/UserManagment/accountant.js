const Accountant = require("../../models/UserManagment/UserSchema");
const { NotFoundError } = require('../../utils/ExpressError');

// GET: All Accountants
const getAccountant = async (req, res) => {
  const accountant = await Accountant.find({ 
    $or: [
      { role: "accountant" },
      { role: "Accountant" }
    ]
  }).sort({ createdAt: -1 });
  res.status(200).json(accountant);
};

// GET: Specific Accountant by ID
const getAccountantById = async (req, res) => {
  const { id } = req.params;
  const accountant = await Accountant.findById(id);
  if (!accountant) {
    throw new NotFoundError('Accountant');
  }
  res.status(200).json(accountant);
};

// PUT: Update Accountant
const updateAccountant = async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, role, customId, assignedTrip } = req.body;

  const accountant = await Accountant.findByIdAndUpdate(
    id,
    { name, email, contact, role, customId, assignedTrip },
    { new: true }
  );

  if (!accountant) {
    throw new NotFoundError('Accountant');
  }

  res.json(accountant);
};

// DELETE: Delete Accountant
const removeAccountant = async (req, res) => {
  const { id } = req.params;
  const accountant = await Accountant.findByIdAndDelete(id);
  if (!accountant) {
    throw new NotFoundError('Accountant');
  }
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  getAccountant,
  getAccountantById,
  updateAccountant,
  removeAccountant,
};