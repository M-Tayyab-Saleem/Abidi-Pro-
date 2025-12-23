// cronJobs.js
const cron = require('node-cron');
const TimeTracker = require("./models/timeTrackerSchema");
const mongoose = require('mongoose');

class CronJobs {
  constructor() {
    this.init();
  }

  init() {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', this.autoCheckoutAtMidnight.bind(this), {
      timezone: "UTC" // Use UTC timezone for consistency
    });

    console.log('Cron jobs initialized: Auto-checkout at midnight');
  }

  async autoCheckoutAtMidnight() {
    try {
      console.log('Running auto-checkout at midnight...');
      
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setUTCHours(0, 0, 0, 0);
            const openSessions = await TimeTracker.find({
        checkInTime: { $exists: true, $ne: null },
        checkOutTime: { $exists: false },
        date: { $lt: todayStart } 
      }).populate('user');

      console.log(`Found ${openSessions.length} open sessions to auto-checkout`);

      let successfullyClosed = 0;
      let errors = 0;

      for (const session of openSessions) {
        try {
          // Get the end of the day for the session's date
          const sessionDateEnd = new Date(session.date);
          sessionDateEnd.setUTCHours(23, 59, 59, 999);
          
          // Set checkout time to end of the session's date
          session.checkOutTime = new Date(sessionDateEnd);
          session.autoCheckedOut = true;
          
          // Calculate total hours worked (cap at 24 hours for safety)
          const totalMs = session.checkOutTime.getTime() - new Date(session.checkInTime).getTime();
          const totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
          
          session.totalHours = Math.min(totalHours, 24); // Cap at 24 hours
          
          // Determine status based on hours worked
          if (session.totalHours >= 8) {
            session.status = "Present";
          } else if (session.totalHours >= 4) {
            session.status = "Half Day";
          } else {
            session.status = "Absent";
          }

          session.notes = session.notes 
            ? `${session.notes} | Auto-checked out at midnight` 
            : 'Auto-checked out at midnight';

          await session.save();
          successfullyClosed++;
          
          const userName = session.user?.name || session.user?.email || session.user || 'Unknown';
          console.log(`Auto-checked out user ${userName} for date ${session.date.toISOString().split('T')[0]}`);

        } catch (error) {
          console.error(`Error auto-checking out session ${session._id}:`, error);
          errors++;
        }
      }

      console.log(`Auto-checkout completed: ${successfullyClosed} successful, ${errors} errors`);

    } catch (error) {
      console.error('Error in auto-checkout cron job:', error);
    }
  }

  // Manual trigger for testing/admin purposes
  async manualAutoCheckout() {
    console.log('Manual auto-checkout triggered...');
    return await this.autoCheckoutAtMidnight();
  }

  // Optional: Also run a cleanup for older open sessions (beyond yesterday)
  // This is now redundant since autoCheckoutAtMidnight handles all previous days
  // But keeping it for backward compatibility or specific cleanup needs
  async cleanupOldOpenSessions() {
    try {
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      // Find all open sessions from any previous day
      const oldOpenSessions = await TimeTracker.find({
        checkInTime: { $exists: true, $ne: null },
        checkOutTime: { $exists: false },
        date: { $lt: todayStart }
      }).populate('user');

      let cleaned = 0;
      for (const session of oldOpenSessions) {
        try {
          const sessionDateEnd = new Date(session.date);
          sessionDateEnd.setUTCHours(23, 59, 59, 999);
          
          session.checkOutTime = new Date(sessionDateEnd);
          session.autoCheckedOut = true;
          
          const totalMs = session.checkOutTime.getTime() - new Date(session.checkInTime).getTime();
          const totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
          
          session.totalHours = Math.min(totalHours, 24);
          
          if (session.totalHours >= 8) {
            session.status = "Present";
          } else if (session.totalHours >= 4) {
            session.status = "Half Day";
          } else {
            session.status = "Absent";
          }
          
          session.notes = session.notes 
            ? `${session.notes} | Auto-closed: Old open session` 
            : 'Auto-closed: Old open session';
          
          await session.save();
          cleaned++;
        } catch (error) {
          console.error(`Error cleaning up session ${session._id}:`, error);
        }
      }

      console.log(`Cleaned up ${cleaned} old open sessions`);
      return { cleaned, total: oldOpenSessions.length };

    } catch (error) {
      console.error('Error in cleanup cron job:', error);
      throw error;
    }
  }
}

module.exports = CronJobs;