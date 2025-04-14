const Dispatcher = require("../../models/UserManagment/UserSchema");
const { NotFoundError } = require('../../utils/ExpressError');

const getAllDispatchers = async (req, res) => {
  const dispatchers = await Dispatcher.find({ 
    $or: [
      { role: "dispatcher" },
      { role: "Dispatcher" }
    ]
  }).sort({ createdAt: -1 });
  res.status(200).json(dispatchers);
};

const getDispatcherById = async (req, res) => {
  const { id } = req.params;
  const dispatcher = await Dispatcher.findById(id);
  if (!dispatcher) {
    throw new NotFoundError('Dispatcher');
  }
  res.status(200).json(dispatcher);
};

const updateDispatcher = async (req, res) => {
  const { id } = req.params;
  const { name, email, contact, role, customId, assignedTrip } = req.body;
  
  const dispatcher = await Dispatcher.findByIdAndUpdate(
    id,
    { name, email, contact, role, customId, assignedTrip },
    { new: true }
  );
  
  if (!dispatcher) {
    throw new NotFoundError('Dispatcher');
  }
  
  res.json(dispatcher);
};

const deleteDispatcher = async (req, res) => {
  const { id } = req.params;
  const dispatcher = await Dispatcher.findByIdAndDelete(id);
  if (!dispatcher) {
    throw new NotFoundError('Dispatcher');
  }
  res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
  getAllDispatchers,
  getDispatcherById,
  updateDispatcher,
  deleteDispatcher,
};