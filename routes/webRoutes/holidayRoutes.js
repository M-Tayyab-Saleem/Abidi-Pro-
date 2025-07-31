const express = require("express");
const router = express.Router();
const holidayController = require("../../controllers/holidayController");

router
  .route("/")
  .post(holidayController.createHoliday)
  .get(holidayController.getAllHolidays);

router
  .route("/:id")
  .get(holidayController.getHolidayById)
  .put(holidayController.updateHoliday)
  .delete(holidayController.deleteHoliday);

router.get("/year/:year", holidayController.getHolidaysByYear);

module.exports = router;