const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require('multer');
const { vehicleDocsStorage } = require("../../storageConfig");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");

const {
  createVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
  deleteVehicle,
  approveVehicle
} = require("../../controllers/VehicleManagment/Vehicle");

const {
  getVehicleAvailability,
} = require("../../controllers/VehicleManagment/VehicleAvailability");

const { 
  vehicleValidateSchema, 
  vehicleUpdateValidate 
} = require("../../JoiSchema/VehicleJoiSchema");

const uploadVehicleDocs = multer({ 
  storage: vehicleDocsStorage,
}).fields([
  { name: 'vehicleFrontImage', maxCount: 1 },
  { name: 'vehicleBackImage', maxCount: 1 },
  { name: 'vehicleRightImage', maxCount: 1 },
  { name: 'vehicleLeftImage', maxCount: 1 },
  { name: 'vehicleRegistrationBookFront', maxCount: 1 }
]);


router.route("/")
  .post(
    uploadVehicleDocs, 
    validateRequest(vehicleValidateSchema), 
    catchAsync(createVehicle)
  )
  .get(catchAsync(getAllVehicles));

  router.patch("/approve/:id", catchAsync(approveVehicle));


router.route("/:id")
  .get(catchAsync(getVehicleById))
  .put(
    uploadVehicleDocs,
    (req, res, next) => {
      const status = req.body.status;
      validateRequest((data) => vehicleUpdateValidate(data, status))(req, res, next);
    },
    catchAsync(updateVehicle)
  )
  .delete(catchAsync(deleteVehicle));

router.route("/availability")
  .get(catchAsync(getVehicleAvailability));

module.exports = router;