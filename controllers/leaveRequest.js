const LeaveRequest = require("../models/leaveRequestSchema");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");
const User = require("../models/userSchema");

// Create Leave Request
exports.createLeaveRequest = catchAsync(async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const user = req.user;

  if (!leaveType || !startDate || !endDate) {
    throw new BadRequestError("Missing required fields");
  }

  // Calculate days difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Check if user has enough leaves
  if (user.avalaibleLeaves < daysDiff && leaveType !== "Unpaid") {
    throw new BadRequestError("Not enough available leaves");
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

  // Update user's leave data
  await User.findByIdAndUpdate(user._id, {
    $inc: {
      avalaibleLeaves: leaveType === "Unpaid" ? 0 : -daysDiff,
      bookedLeaves: daysDiff
    },
    $push: {
      leaveHistory: {
        leaveId: savedLeaveRequest._id,
        leaveType,
        startDate: start,
        endDate: end,
        status: 'Pending',
        daysTaken: daysDiff
      }
    }
  });

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

  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (!status || !validStatuses.includes(status)) {
    throw new BadRequestError("Invalid or missing status");
  }

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    throw new NotFoundError("Leave request not found");
  }

  // Calculate days difference
  const start = new Date(leaveRequest.startDate);
  const end = new Date(leaveRequest.endDate);
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // If status changed from Approved to Rejected, return leaves
  if (leaveRequest.status === "Approved" && status === "Rejected") {
    await User.findByIdAndUpdate(leaveRequest.employee, {
      $inc: {
        avalaibleLeaves: leaveRequest.leaveType === "Unpaid" ? 0 : daysDiff,
        bookedLeaves: -daysDiff
      },
      $set: {
        "leaveHistory.$[elem].status": status
      }
    }, {
      arrayFilters: [{ "elem.leaveId": leaveRequest._id }]
    });
  }

  // If status changed to Approved, deduct leaves (if not already approved)
  if (status === "Approved" && leaveRequest.status !== "Approved") {
    await User.findByIdAndUpdate(leaveRequest.employee, {
      $set: {
        "leaveHistory.$[elem].status": status
      }
    }, {
      arrayFilters: [{ "elem.leaveId": leaveRequest._id }]
    });
  }

  leaveRequest.status = status;
  await leaveRequest.save();

  res.status(200).json({
    success: true,
    message: `Leave status updated to ${status}`,
    data: leaveRequest,
  });
});