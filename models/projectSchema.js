const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectID: {
    type: String,
    required: true,
    unique: true
  },
  projectName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    
    required: true
  }],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  tasks: [{
    type: String,
  }],
  completedTasks: {
    type: Number,
    default: 0
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',    
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);
