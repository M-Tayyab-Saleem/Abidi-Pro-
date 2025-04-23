const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { userSchema, userUpdateSchema } = require("../../JoiSchema/UserJoiSchema");


const {
  postAccountant,
  getAccountant,
  getAccountantById,
  updateAccountant,
  removeAccountant,
} = require("../../controllers/UserManagment/accountant");


router.route("/")
  .post(isLoggedIn, restrictTo('admin'), validateRequest(userSchema), catchAsync(postAccountant))
  .get(isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(getAccountant));

router.route("/:id")
  .get(isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(getAccountantById))
  .put(isLoggedIn, restrictTo('admin', 'accountant'), validateRequest(userUpdateSchema), catchAsync(updateAccountant))
  .delete(isLoggedIn, restrictTo('admin', 'accountant'), catchAsync(removeAccountant));

module.exports = router;