const express = require("express");
const router = express.Router();

const authRoutes = require("./webRoutes/authRoutes");
const userRoutes = require("./webRoutes/userRoutes");
const leaveRoutes = require("./webRoutes/leaveRoutes");
const projectRoutes = require("./webRoutes/projectRoutes");
const logRoutes = require("./webRoutes/logRoutes");
const companyRoutes = require("./webRoutes/companyRoutes");
const taskRoutes = require("./webRoutes/taskRoutes");
const ticketRoutes = require("./webRoutes/ticketRoutes");
const timeTrackerRoutes = require("./webRoutes/timeTrackerRoutes");
const { isLoggedIn } = require("../middlewares/authMiddleware");


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use('/files/cloudinary',isLoggedIn, require('./webRoutes/cloudinaryRoutes'));
router.use('/files/folders', isLoggedIn,   require('./webRoutes/folderRoutes'));
router.use('/files/files',      isLoggedIn,require('./webRoutes/filesRoute'));
router.use("/leaves", leaveRoutes);
router.use("/projects", projectRoutes);
router.use("/logs", logRoutes);
router.use("/companies", companyRoutes);
router.use("/tasks", taskRoutes);
router.use("/tickets", ticketRoutes);
router.use("/timetrackers", timeTrackerRoutes);

module.exports = router;
