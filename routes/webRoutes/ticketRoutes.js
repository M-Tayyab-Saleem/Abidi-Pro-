const express = require("express");
const router = express.Router();
const ticketController = require("../../controllers/ticketController");
const catchAsync = require("../../utils/catchAsync");

router
  .route("/")
  .post(catchAsync(ticketController.createTicket))
  .get(catchAsync(ticketController.getAllTickets));

router
  .route("/:id")
  .get(catchAsync(ticketController.getTicketById))
  .put(catchAsync(ticketController.updateTicket))
  .delete(catchAsync(ticketController.deleteTicket));

module.exports = router;
