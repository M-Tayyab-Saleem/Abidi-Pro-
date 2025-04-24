const Joi = require("joi");

const passengerSchema = Joi.object({
  passengerName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Passenger name cannot be empty",
    "string.min": "Passenger name should have at least 2 characters",
    "string.max": "Passenger name cannot exceed 50 characters",
    "any.required": "Passenger name is required",
  }),

  passengerContact: Joi.string()
    .pattern(/^((\+92)|(0092)|(92)|(0))?(3[0-9]{9})$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)",
      "any.required": "Contact number is required",
    }),

  passengerEmail: Joi.string().email().allow("").messages({
    "string.email": "Please enter a valid email address",
  }),

  passengerTotalRides: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Ride count must be a number",
    "number.integer": "Ride count must be an integer",
    "number.min": "Ride count cannot be negative",
  }),

  passengerGender: Joi.string()
    .valid("Male", "Female", "Other", "Prefer not to say")
    .allow("")
    .messages({
      "any.only": "Gender must be Male, Female, Other, or Prefer not to say",
    }),
  passengerJoiningDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .messages({
      "string.pattern.base": "Invalid date format (use DD-MM-YYYY)",
      "string.base": "Date must be a string",
    }),
});

const passengerUpdateSchema = passengerSchema.fork(
  ["passengerName", "passengerContact"],
  (schema) => schema.optional()
);

module.exports = {
  passengerSchema,
  passengerUpdateSchema,
};
