const attendanceSchema = require("../models/attendanceSchema");
const employeeModal = require("../models/employeeModel");

exports.checkInn= async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { status } = req.body;
  
      const employee = await employeeModal.findById(employeeId);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      // Check if the employee already has a record for today
      const today = new Date().setHours(0, 0, 0, 0); // Set the time to midnight
      let attendance = await attendanceSchema.findOne({ employee: employeeId, date: today });
      if (attendance) {
        return res.status(400).json({ message: 'Attendance already marked for today' });
      }
      // Create a new attendance record for the employee
      attendance = new attendanceSchema({
        employee: employeeId,
        date: new Date(),
        checkIn: new Date(),
        status: status || 'Present',
      });
  
      await attendance.save();
      res.status(201).json({ success: true, message: 'Checked in successfully', data: attendance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  exports.checkOut= async (req, res) => {
    try {
      const { attendanceId } = req.params;
  
      const attendance = await attendanceSchema.findById(attendanceId);
      if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
  
      // Ensure the employee has checked in
      if (!attendance.checkIn) {
        return res.status(400).json({ message: 'You must check in first' });
      }
  
      // Check-out and calculate work hours
      attendance.checkOut = new Date();
  
      const workDuration = attendance.calculateWorkHours();
  
      if (workDuration < 8) {
        attendance.status = 'Absent'; // Mark as absent if less than 8 hours
        attendance.notes = 'Worked less than 8 hours. Attendance not marked.';
      } else {
        attendance.status = 'Present'; // Otherwise, mark as present
      }
  
      await attendance.save();
      res.status(200).json({ success: true, message: 'Checked out successfully', data: attendance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }



 exports.getAttendanceById= async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query; // Optional query parameters for date range
  
      const query = { employee: employeeId };
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }
  
      const attendances = await Attendance.find(query).populate('employee', 'name email department');
  
      if (!attendances.length) {
        return res.status(404).json({ message: 'No attendance records found' });
      }
  
      res.status(200).json({ success: true, data: attendances });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }


  exports.getAllAttendanceByCompany= async (req, res) => {
    try {
      const { companyId } = req.params;
  
      // Fetch all attendance records for all employees in the company
      const attendances = await attendanceSchema.find({ 'employee.company': companyId }).populate('employee', 'name email department');
  
      if (!attendances.length) {
        return res.status(404).json({ message: 'No attendance records found for this company' });
      }
  
      res.status(200).json({ success: true, data: attendances });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

 exports.getEmployeeAttendanceWeekly = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query; // Optional query parameters for the week range
  
      const weeklyAttendance = await attendanceSchema.find({
        employee: employeeId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }).sort({ date: 1 });
  
      if (!weeklyAttendance.length) {
        return res.status(404).json({ message: 'No attendance records found for this week' });
      }
  
      res.status(200).json({ success: true, data: weeklyAttendance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }