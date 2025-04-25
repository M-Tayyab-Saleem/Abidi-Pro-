const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middlewares/authMiddleware");
const { restrictTo } = require("../../middlewares/roleMiddleware");
const validateRequest = require("../../middlewares/validateRequest");
const { zoneSchema, zoneUpdateSchema } = require("../../JoiSchema/ZoneJoiSchema");

const {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
} = require("../../controllers/Zone/Zone");

router.route("/")
  .get(catchAsync(getAllZones))
  .post(validateRequest(zoneSchema), catchAsync(createZone));

router.route("/:id")
  .get(catchAsync(getZoneById))
  .put(validateRequest(zoneUpdateSchema), catchAsync(updateZone))
  .delete(catchAsync(deleteZone));

module.exports = router;