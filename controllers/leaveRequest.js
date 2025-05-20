const LeaveRequest = require("../models/leaveRequestSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create Leave Request
exports.createLeaveRequest = catchAsync(async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const user = req.user;
  if (!leaveType || !startDate || !endDate) {
    throw new BadRequestError("Missing required fields");
  }

  const leaveRequest = new LeaveRequest({
    employee: user._id,
    employeeName: user.name,
    email: user.email,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  const savedLeaveRequest = await leaveRequest.save();
  res.status(201).json({ success: true, data: savedLeaveRequest });
});

// Get all Leave Requests
exports.getLeaveRequests = catchAsync(async (req, res) => {
  const query = {};
  if (req.query.employeeName) query.employeeName = req.query.employeeName;
  if (req.query.leaveType) query.leaveType = req.query.leaveType;
  if (req.query.status) query.status = req.query.status;

  const leaveRequests = await LeaveRequest.find(query);
  res.json({ success: true, data: leaveRequests });
});

// Get Leave Request by ID
exports.getLeaveRequestById = catchAsync(async (req, res) => {
  const leaveRequest = await LeaveRequest.findById(req.params.id);
  if (!leaveRequest) {
    throw new NotFoundError("Leave request");
  }
  res.json({ success: true, data: leaveRequest });
});

// Update Leave Request
exports.updateLeaveRequest = catchAsync(async (req, res) => {
  const { employeeName, leaveType, startDate, endDate, reason, status } = req.body;

  const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { employeeName, leaveType, startDate, endDate, reason, status },
    { new: true }
  );

  if (!updatedLeaveRequest) {
    throw new NotFoundError("Leave request");
  }

  res.json({ success: true, data: updatedLeaveRequest });
});

// Delete Leave Request
exports.deleteLeaveRequest = catchAsync(async (req, res) => {
  const leaveRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
  if (!leaveRequest) {
    throw new NotFoundError("Leave request");
  }
  res.json({ success: true, message: "Leave request deleted" });
});


// Update Leave Status
exports.updateLeaveStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // if (req.user?.role !== "admin") {
  //   throw new UnauthorizedError("Only admins can update leave status");
  // }

  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (!status || !validStatuses.includes(status)) {
    throw new BadRequestError("Invalid or missing status");
  }

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    throw new NotFoundError("Leave request not found");
  }

  leaveRequest.status = status;
  await leaveRequest.save();

  res.status(200).json({
    success: true,
    message: `Leave status updated to ${status}`,
    data: leaveRequest,
  });
});