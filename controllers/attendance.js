const attendanceSchema = require("../../models/attendanceSchema");


// Create Leave Request
exports.createLeaveRequest = async (req, res) => {
  try {
    const { employeeName, leaveType, startDate, endDate, reason, status } = req.body;
    
    const attendance = new attendanceSchema({
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
