const Accountant = require("../../models/UserManagment/UserSchema");
const { NotFoundError } = require('../../utils/ExpressError');

//accountant controller
const getAccountant = async (req, res) => {
  const accountant = await Accountant.find({ 
    $or: [
      { role: "accountant" },
      { role: "Accountant" }
    ]
  }).sort({ createdAt: -1 });
  res.status(200).json(accountant);
};


const getAccountantById = async (req, res) => {
  const { id } = req.params;
  const accountant = await Accountant.findById(id);
  if (!accountant) {
    throw new NotFoundError('Accountant');
  }
  res.status(200).json(accountant);
};


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