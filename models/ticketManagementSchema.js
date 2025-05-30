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
    name: String,
    url: String
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
  },
  status: {
    type: String,
    enum: ['opened', 'in progress', 'closed'],
    default: 'Open'
  }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
