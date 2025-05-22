const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");

const userController = require("../../controllers/userController");

// User Routes

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/search")
  .get(userController.getUserById);

module.exports = router;
