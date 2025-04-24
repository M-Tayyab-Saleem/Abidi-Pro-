const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { userSchema, userUpdateSchema } = require("../../JoiSchema/UserJoiSchema");


const {
  getAllDispatchers,
  getDispatcherById,
  updateDispatcher,
  deleteDispatcher,
} = require("../../controllers/UserManagment/dispatacher");

router.route("/")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/  catchAsync(getAllDispatchers));

router.route("/:id")
  .get(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/  catchAsync(getDispatcherById))
  .put(/*isLoggedIn, restrictTo('admin', 'dispatcher'), validateRequest(userUpdateSchema),*/  catchAsync(updateDispatcher))
  .delete(/*isLoggedIn, restrictTo('admin', 'dispatcher'),*/  catchAsync(deleteDispatcher));

module.exports = router;