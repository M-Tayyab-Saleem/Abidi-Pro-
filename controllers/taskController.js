const Task = require("../models/taskSchema");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    .populate('assignedTo')
    .populate('assignedBy');

    res.status(200).json(tasks);
    console.log("All Tasks Found Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    .populate('assignedTo')
    .populate('assignedBy');
    
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    taskName,
    taskDescription,
    startDate,
    endDate,
    assignedTo,
    assignedBy,
    priority,
    status
  } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.taskName = taskName || task.taskName;
    task.taskDescription = taskDescription || task.taskDescription;
    task.startDate = startDate || task.startDate;
    task.endDate = endDate || task.endDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.assignedBy = assignedBy || task.assignedBy;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task" });
  }
};


// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
