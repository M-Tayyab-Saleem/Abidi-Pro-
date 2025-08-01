const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: true
  },
  projectId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',   
    required: true
  },
  comments:[{
    commenter:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   
    required: true
  },
  comment:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    required:true
  }
}
],
  taskId: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date
  },
  assignedTo:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   
    required: true
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Blocked'],
    default: 'Pending'
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   
    required: true
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);
