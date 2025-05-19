const Ticket = require("../models/ticketManagementSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError } = require("../utils/ExpressError");

// Create Ticket
exports.createTicket = catchAsync(async (req, res) => {
  const ticket = new Ticket(req.body);
  const savedTicket = await ticket.save();
  res.status(201).json(savedTicket);
});

// Get All Tickets
exports.getAllTickets = catchAsync(async (req, res) => {
  const tickets = await Ticket.find().populate('closedBy');
  res.status(200).json(tickets);
});

// Get Ticket by ID
exports.getTicketById = catchAsync(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('closedBy');
  if (!ticket) throw new NotFoundError("Ticket");
  res.status(200).json(ticket);
});

// Update Ticket
exports.updateTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError("Ticket");

  Object.assign(ticket, updates);
  const updated = await ticket.save();

  res.status(200).json(updated);
});

// Delete Ticket
exports.deleteTicket = catchAsync(async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);
  if (!ticket) throw new NotFoundError("Ticket");

  res.status(200).json({ message: "Ticket deleted successfully" });
});
