const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    timeZone: {
      type: String,
      // enum: Intl.supportedValuesOf("timeZone"),
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    empID: {
      type: String,
      required: true,
      unique: true,
    },
    
    // --- HIERARCHY & ROLE (Updated) ---
    
    // 1. Who is their boss? (Self-Referencing)
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      default: null // CEO has no boss
    },

    // 2. Security Role (What can they DO?)
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "HR", "Manager", "Employee"], 
      required: true,
      default: "Employee"
    },

    // 3. Department Reference (Where do they SIT?)
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },

    // 4. Seniority Level (Helper for sorting: 1=CEO, 5=Intern)
    jobLevel: {
      type: Number,
      default: 5 
    },

    // ------------------------------------

    designation: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    empType: {
      type: String,
      enum: ["Permanent", "Contractor", "Intern", "Part Time"],
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    address: {
      type: String,
    },
    empStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    salary: {
      type: Number,
    },
    about: {
      type: String,
    },
    experience: [
      {
        company: String,
        jobType: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    DOB: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    emergencyContact: [
      {
        name: String,
        relation: String,
        phone: Number,
      },
    ],
    addedby: {
      type: String,
    },
    otp: {
      type: Number,
    },
    otpExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    avalaibleLeaves: {
      type: Number,
      default: 15,
    },
    bookedLeaves: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: ""
    },
    leaveHistory: [{
      leaveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeaveRequest"
      },
      leaveType: String,
      startDate: Date,
      endDate: Date,
      status: String,
      daysTaken: Number
    }],
    leaves: {
      pto: {
        type: Number,
        default: 10,
      },
      sick: {
        type: Number,
        default: 5,
      }
    },
    dashboardCards: [{
      type: {
        type: String,
        required: true,
        enum: ["feeds", "attendance", "holidays", "todo", "notes", "recent activities",
          "birthdays", "leavelog", "upcomingDeadlines", "timeoffBalance", "tasksAssignedToMe"]
      },
      id: {
        type: String,
        required: true
      }
    }]
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  const jwt = require("jsonwebtoken");
  const payload = {
    userId: this._id,
    role: this.role,
    department: this.department // Helpful to have this in the token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (!user) return next();

  const userId = user._id;

  // Clean dependent collections
  await Promise.all([
    mongoose.model("Ticket").deleteMany({
      $or: [{ closedBy: userId }, { assignedTo: userId }]
    }),

    mongoose.model("LeaveRequest").deleteMany({ employee: userId }),

    mongoose.model("TimeLog").deleteMany({ employee: userId }),

    mongoose.model("Timesheet").deleteMany({ employee: userId }),

    mongoose.model("TimeTracker").deleteMany({ user: userId }),

    // Remove user from departments
    mongoose.model("Department").updateMany(
      {},
      {
        $pull: {
          members: userId
        },
        $set: {
          manager: null
        }
      }
    ),

    // Fix reporting hierarchy
    mongoose.model("User").updateMany(
      { reportsTo: userId },
      { $set: { reportsTo: null } }
    )
  ]);

  next();
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;