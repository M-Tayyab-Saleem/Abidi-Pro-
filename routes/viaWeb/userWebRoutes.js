const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { userUpdateSchema } = require("../../JoiSchema/UserJoiSchema");


const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../../controllers/UserManagment/User");


router.route("/")
  .get(isLoggedIn, restrictTo('admin', 'dispatcher'), catchAsync(getAllUsers));

router.route("/current")
  .get(isLoggedIn, catchAsync(getCurrentUser));

router.route("/:id")
  .get(isLoggedIn, catchAsync(getUserById))
  .put(isLoggedIn, validateRequest(userUpdateSchema), catchAsync(updateUser))
  .delete(isLoggedIn, catchAsync(deleteUser));

module.exports = router;