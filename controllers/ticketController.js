const Ticket = require("../models/ticketManagementSchema");
const catchAsync = require("../utils/catchAsync");
const { NotFoundError } = require("../utils/ExpressError");

// Create Ticket
exports.createTicket = catchAsync(async (req, res) => {
  const {
    emailAddress,
    subject,
    description,
    ticketID
  } = req.body;

  const newTicket = {
    emailAddress,
    subject,
    description,
    ticketID,
    attachments: [],
    closedBy: req.user?.id|| undefined 
  };

   
  // Handle Cloudinary file upload
  if (req.file && req.file.path) {
    newTicket.attachments.push({
      name: req.file.originalname,
      url: req.file.path
    });
  }

  const ticket = new Ticket(newTicket);
  ticket.status = 'opened'; 
  ticket.priority = 'Medium Priority'; 
  const savedTicket = await ticket.save();
  res.status(201).json(savedTicket);
});



// Get All Tickets
exports.getAllTickets = catchAsync(async (req, res) => {
  const tickets = await Ticket.find().populate('closedBy');
  res.status(200).json(tickets);
});

//Get all tickets of logged in user
exports.getUserTickets = catchAsync(async (req, res) => {
  const email = req.query.email

  const tickets = await Ticket.find({email}).populate('closedBy');
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


// PATCH /tickets/:id/status
exports.updateTicketStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["opened", "in progress", "closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket);
});


// PATCH /tickets/:id/priority
exports.updateTicketPriority = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  if (!["High Priority", "Medium Priority", "Low Priority"].includes(priority)) {
    return res.status(400).json({ message: "Invalid priority" });
  }

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { priority },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket);
});


exports.updateTicketAssignee = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  if (!assignedTo || typeof assignedTo !== 'string') {
    return res.status(400).json({ message: "Assigned user ID is required and must be a string" });
  }

  const ticket = await Ticket.findByIdAndUpdate(
    id,
    { assignedTo },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket);
});


exports.addTicketResponse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { content, avatar } = req.body;

  console.log("Adding response to ticket:", id, "Content:", content, "Avatar:", avatar);

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError("Ticket");

  console.log(req.user, "User making the response:", req.user);

  const newResponse = {
    author: req.user?.name || "Unknown",
    content,
    time: new Date().toISOString(),
    avatar
  };

  ticket.responses.push(newResponse);
  await ticket.save();

  res.status(200).json(ticket);
});
