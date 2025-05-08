const LeaveRequest = require("../../models/LeaveRequest/leaveRequestSchema");

// Create Leave Request
exports.createLeaveRequest = async (req, res) => {
  try {
    const { employeeName, leaveType, startDate, endDate, reason, status } = req.body;
    
    const leaveRequest = new LeaveRequest({
      employeeName,
      leaveType,
      startDate,
      endDate,
      reason,
      status
    });

    const savedLeaveRequest = await leaveRequest.save();
    res.status(201).json({ success: true, data: savedLeaveRequest });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create leave request", error: err.message });
  }
};

// Get all Leave Requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const query = {};
    if (req.query.employeeName) query.employeeName = req.query.employeeName;
    if (req.query.leaveType) query.leaveType = req.query.leaveType;
    if (req.query.status) query.status = req.query.status;

    const leaveRequests = await LeaveRequest.find(query);
    res.json({ success: true, data: leaveRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to list leave requests", error: err.message });
  }
};

// Get Leave Request by ID
exports.getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }
    res.json({ success: true, data: leaveRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching leave request", error: err.message });
  }
};

// Update Leave Request
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { employeeName, leaveType, startDate, endDate, reason, status } = req.body;

    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id, 
      { employeeName, leaveType, startDate, endDate, reason, status }, 
      { new: true }
    );

    if (!updatedLeaveRequest) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }
    res.json({ success: true, data: updatedLeaveRequest });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update leave request", error: err.message });
  }
};

// Delete Leave Request
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }
    res.json({ success: true, message: "Leave request deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to delete leave request", error: err.message });
  }
};


