const express = require("express");
const router = express.Router();
const multer = require("multer");
const { userProfileStorage } = require("../../storageConfig");
const upload = multer({ storage: userProfileStorage });
const catchAsync = require("../../utils/catchAsync");
const userController = require("../../controllers/userController");

// User Routes
router
  .route("/")
  .post(upload.single("profilePhoto"), userController.createUser)
  .get(userController.getAllUsers);

router.get("/admins", userController.getAdminUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(upload.single("profilePhoto"), userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/search")
  .get(userController.getUserById);

module.exports = router;