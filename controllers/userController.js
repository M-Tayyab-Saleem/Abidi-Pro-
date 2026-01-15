const User = require("../models/userSchema");
const Department = require("../models/departemt"); // Make sure this model exists
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// 1. Create User
exports.createUser = catchAsync(async (req, res) => {
  const {
    name, email, timeZone, reportsTo, password, empID, role,
    phoneNumber, designation, department, branch, empType, joiningDate,
    about, salary, education, address, experience, DOB,
    maritalStatus, emergencyContact, addedby
  } = req.body;

  // 1. Check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create User Instance
  const newUser = new User({
    name,
    email,
    timeZone,
    reportsTo: reportsTo || null, // Handle empty string from frontend
    password: hashedPassword,
    empID,
    role,
    phoneNumber,
    designation, 
    department,  // This should be an ObjectId
    branch,
    empType,
    joiningDate,
    about,
    salary,
    education,
    address,
    experience,
    DOB,
    maritalStatus,
    emergencyContact,
    addedby
  });

  // 4. Save User
  const savedUser = await newUser.save();

  // 5. AUTO-LINK: Add this User to the Department's "members" array
  if (department) {
    await Department.findByIdAndUpdate(department, {
      $push: { members: savedUser._id }
    });
  }

  res.status(201).json(savedUser);
});

// 2. Get All Users
exports.getAllUsers = catchAsync(async (req, res) => {
  // Populate Department name and Manager name for the UI
  const users = await User.find()
    .populate("department", "name") // Only fetch department name
    .populate("reportsTo", "name designation"); // Only fetch manager name & role

  res.status(200).json(users);
});

// 3. Get User by ID
exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("department", "name")
    .populate("reportsTo", "name designation");

  if (!user) throw new NotFoundError("User not found");

  res.status(200).json(user);
});

// 4. Update User
exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  
  // Find original user to check for department changes
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User not found");

  // --- HANDLE DEPARTMENT TRANSFER ---
  // If department is changing, update the old and new department lists
  if (updates.department && updates.department !== user.department?.toString()) {
    const oldDeptId = user.department;
    const newDeptId = updates.department;

    // Remove from Old Department
    if (oldDeptId) {
      await Department.findByIdAndUpdate(oldDeptId, {
        $pull: { members: id }
      });
    }

    // Add to New Department
    if (newDeptId) {
      await Department.findByIdAndUpdate(newDeptId, {
        $push: { members: id }
      });
    }
  }
  // ----------------------------------

  // Filter allowed fields
  const allowedFields = [
    "name", "email", "timeZone", "reportsTo", "empID", "role",
    "phoneNumber", "designation", "department", "branch", "empType", "joiningDate",
    "about", "salary", "education", "address", "experience", "DOB",
    "maritalStatus", "emergencyContact", "addedby", "empStatus", "avalaibleLeaves"
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// 5. Delete User
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new NotFoundError("User not found");

  // Cleanup: Remove user from their department
  if (user.department) {
    await Department.findByIdAndUpdate(user.department, {
      $pull: { members: id }
    });
  }

  res.status(200).json({ message: "User deleted successfully" });
});

// --- ADMIN / UTILS ---

exports.getAdminUsers = catchAsync(async (req, res) => {
  const admins = await User.find({ role: "Admin" });
  res.status(200).json(admins);
});

exports.getDashboardCards = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('dashboardCards');
  if (!user) throw new NotFoundError("User");
  res.status(200).json(user.dashboardCards);
});

exports.addDashboardCard = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");
  
  if (user.dashboardCards.some(card => card.type === type)) {
    throw new BadRequestError("Card already exists");
  }
  
  user.dashboardCards.push({
    type,
    id: Date.now().toString()
  });
  
  await user.save();
  res.status(201).json(user.dashboardCards);
});

exports.removeDashboardCard = catchAsync(async (req, res) => {
  const { id, cardId } = req.params;
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");
  
  const initialLength = user.dashboardCards.length;
  user.dashboardCards = user.dashboardCards.filter(card => card.id !== cardId);
  
  if (user.dashboardCards.length === initialLength) {
    throw new NotFoundError("Card not found");
  }
  
  await user.save();
  res.status(200).json(user.dashboardCards);
});

exports.getUserLeaves = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('leaves');
  if (!user) throw new NotFoundError("User");
  res.status(200).json(user.leaves);
});

exports.updateUserLeaves = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { paid, sick, majlis, casual, earned } = req.body;
  
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");
  
  if (paid !== undefined) user.leaves.paid = paid;
  if (sick !== undefined) user.leaves.sick = sick;
  if (majlis !== undefined) user.leaves.majlis = majlis;
  if (casual !== undefined) user.leaves.casual = casual;
  if (earned !== undefined) user.leaves.earned = earned;
  
  await user.save();
  res.status(200).json(user.leaves);
});

exports.getUpcomingBirthdays = catchAsync(async (req, res) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; 
  const currentDay = today.getDate();

  const users = await User.aggregate([
    {
      $project: {
        name: 1,
        DOB: 1,
        avatar: 1, 
        birthMonth: { $month: { $toDate: "$DOB" } },
        birthDay: { $dayOfMonth: { $toDate: "$DOB" } },
        daysUntilBirthday: {
          $let: {
            vars: {
              nextBirthday: {
                $dateFromParts: {
                  year: {
                    $cond: [
                      {
                        $and: [
                          { $gte: [{ $month: { $toDate: "$DOB" } }, currentMonth] },
                          { $gt: [{ $dayOfMonth: { $toDate: "$DOB" } }, currentDay] }
                        ]
                      },
                      today.getFullYear(),
                      today.getFullYear() + 1
                    ]
                  },
                  month: { $month: { $toDate: "$DOB" } },
                  day: { $dayOfMonth: { $toDate: "$DOB" } }
                }
              }
            },
            in: {
              $divide: [
                { $subtract: ["$$nextBirthday", today] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      }
    },
    { $match: { daysUntilBirthday: { $gte: 0, $lte: 30 } } },
    { $sort: { daysUntilBirthday: 1 } },
    { $limit: 3 }
  ]);

  const formattedBirthdays = users.map(user => {
    const birthDate = new Date(user.DOB);
    return {
      name: user.name,
      date: birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: birthDate.toLocaleDateString('en-US', { weekday: 'long' }),
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      color: `bg-blue-100 text-blue-700`
    };
  });

  res.status(200).json(formattedBirthdays);
});

exports.uploadAvatar = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!req.file) throw new BadRequestError('No file uploaded');

  const user = await User.findByIdAndUpdate(
    id,
    { avatar: req.file.path },
    { new: true }
  );

  if (!user) throw new NotFoundError("User");

  res.status(200).json({
    status: 'success',
    avatarUrl: user.avatar
  });
});