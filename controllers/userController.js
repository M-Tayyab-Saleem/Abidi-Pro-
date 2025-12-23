const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const { BadRequestError, NotFoundError } = require("../utils/ExpressError");

// Create User
exports.createUser = catchAsync(async (req, res) => {
  const {
    name, email, timeZone, reportsTo, password, empID, role,
    phoneNumber, designation, department, branch, empType, joiningDate,
    about, salary, education, address, experience, DOB,
    maritalStatus, emergencyContact, addedby
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    name,
    email,
    timeZone,
    reportsTo,
    password: hashedPassword,
    empID,
    role,
    phoneNumber,
    designation, // ObjectId ref
    department,  // ObjectId ref
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

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

// Get All Users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get User by ID
exports.getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) throw new NotFoundError("User");

  res.status(200).json(user);
});


// Update User
exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");

  // Only update allowed fields
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

// Delete User
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new NotFoundError("User");

  res.status(200).json({ message: "User deleted successfully" });
});


exports.getAdminUsers = catchAsync(async (req, res) => {
  const admins = await User.find({ role: `Admin` });
  res.status(200).json(admins);
});


// Get user's dashboard cards
exports.getDashboardCards = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('dashboardCards');
  
  if (!user) throw new NotFoundError("User");
  
  res.status(200).json(user.dashboardCards);
});

// Add a dashboard card
exports.addDashboardCard = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  
  const user = await User.findById(id);
  if (!user) throw new NotFoundError("User");
  
  // Check if card already exists
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

// Remove a dashboard card
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

// Get upcoming birthdays
exports.getUpcomingBirthdays = catchAsync(async (req, res) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = today.getDate();

  // Find users with birthdays in the next 30 days
  const users = await User.aggregate([
    {
      $project: {
        name: 1,
        DOB: 1,
        avatar: 1, // Assuming you have an avatar field in your schema
        // Extract month and day from DOB for comparison
        birthMonth: { $month: { $toDate: "$DOB" } },
        birthDay: { $dayOfMonth: { $toDate: "$DOB" } },
        // Calculate days until birthday
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
    {
      $match: {
        daysUntilBirthday: { $gte: 0, $lte: 30 } // Next 30 days
      }
    },
    {
      $sort: { daysUntilBirthday: 1 } // Sort by soonest
    },
    {
      $limit: 3 // Only return top 3
    }
  ]);

  // Format the response
  const formattedBirthdays = users.map(user => {
    const birthDate = new Date(user.DOB);
    return {
      name: user.name,
      date: birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: birthDate.toLocaleDateString('en-US', { weekday: 'long' }),
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      color: `bg-${['pink', 'blue', 'yellow'][Math.floor(Math.random() * 3)]}-100 text-${['pink', 'blue', 'yellow'][Math.floor(Math.random() * 3)]}-700`
    };
  });

  res.status(200).json(formattedBirthdays);
});


exports.uploadAvatar = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

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