const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  attachments: [{
    type: String 
  }],
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketID: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
