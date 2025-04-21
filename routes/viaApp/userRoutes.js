const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const validateRequest = require("../../middlewares/validateRequest");

// Import controllers
const {
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../../controllers/UserManagment/User");

// Import validation schemas
const {
  userUpdateSchema,
} = require("../../JoiSchema/UserJoiSchema");


// User profile routes
router.route("/profile/:id")
  .get(isLoggedIn, catchAsync(getUserById))
  .put(isLoggedIn, validateRequest(userUpdateSchema), catchAsync(updateUser))
  .delete(isLoggedIn, catchAsync(deleteUser));


// Current user route
router.route("/current")
  .get(isLoggedIn, catchAsync(getCurrentUser));

module.exports = router;