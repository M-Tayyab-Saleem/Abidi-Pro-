const Ticket = require("../models/ticketManagementSchema");

// CREATE
exports.createTicket = async (req, res) => {
  const {
    emailAddress,
    subject,
    description,
    attachments,
    closedBy,
    ticketID
  } = req.body;

  try {
    const newTicket = new Ticket({
      emailAddress,
      subject,
      description,
      attachments,
      closedBy,
      ticketID
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// READ ALL
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('closedBy');
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

// READ BY ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('closedBy');
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// UPDATE
exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const {
    emailAddress,
    subject,
    description,
    attachments,
    closedBy,
    ticketID
  } = req.body;

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.emailAddress = emailAddress || ticket.emailAddress;
    ticket.subject = subject || ticket.subject;
    ticket.description = description || ticket.description;
    ticket.attachments = attachments || ticket.attachments;
    ticket.closedBy = closedBy || ticket.closedBy;
    ticket.ticketID = ticketID || ticket.ticketID;

    const updated = await ticket.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

// DELETE
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
