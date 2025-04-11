const Joi = require("joi");

const driverValidationSchema = Joi.object({
  driverID: Joi.string(),

  driverName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Driver name cannot be empty",
    "string.min": "Driver name must be at least 3 characters",
    "string.max": "Driver name cannot exceed 50 characters",
    "any.required": "Driver name is required",
  }),

  driverContact: Joi.string()
  .pattern(/^((\+92)|(0092)|(92)|(0))?(3[0-9]{9})$/)
  .required()
  .messages({
    'string.pattern.base': 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)',
    'any.required': 'Contact number is required'
  }),

  driverEarning: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/) // Decimal number
    .messages({
      "string.pattern.base": "Earnings must be a valid number",
    }),

  driverJoiningDate: Joi.date().iso().messages({
    "date.base": "Invalid date format (use YYYY-MM-DD)",
  }),

  driverAge: Joi.string()
    .pattern(/^[1-9][0-9]?$/) // 1-99
    .messages({
      "string.pattern.base": "Age must be between 1-99",
    }),

  driverGender: Joi.string().valid("Male", "Female", "Other").messages({
    "any.only": "Gender must be Male, Female or Other",
  }),

  driverRating: Joi.string()
    .pattern(/^[0-5](\.\d{1})?$/) // 0-5 with 1 decimal
    .messages({
      "string.pattern.base": "Rating must be between 0-5",
    }),

  driverCnic: Joi.string()
    .pattern(/^[0-9]{13}$/) // 13 digit CNIC
    .required()
    .messages({
      "string.pattern.base": "CNIC must be 13 digits",
      "any.required": "CNIC is required",
    }),

  driverCardNumber: Joi.string().creditCard().messages({
    "string.creditCard": "Invalid card number",
  }),

  driverTotalTrips: Joi.string()
    .pattern(/^\d+$/) // Positive integer
    .messages({
      "string.pattern.base": "Trip count must be a number",
    }),

  driverEmail: Joi.string().email().messages({
    "string.email": "Invalid email format",
  }),

  driverAssignedVehicle: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid vehicle ID format",
    }),

  driverCity: Joi.string().max(50).messages({
    "string.max": "City cannot exceed 50 characters",
  }),

  driverBankName: Joi.string().max(50).messages({
    "string.max": "Bank name cannot exceed 50 characters",
  }),

  driverIban: Joi.string()
    .pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/) // Basic IBAN pattern
    .messages({
      "string.pattern.base": "Invalid IBAN format",
    }),

  driverBirthDate: Joi.date().max("now").messages({
    "date.max": "Birth date cannot be in the future",
  }),

  lastseen: Joi.date().messages({
    "date.base": "Invalid date format",
  }),

  // Decline Reasons
  driverDeclineReason: Joi.string().max(500).messages({
    "string.max": "Decline reason cannot exceed 500 characters",
  }),

  driverReSubmit: Joi.string(),

  vehicleDeclineReason: Joi.string().max(500).messages({
    "string.max": "Decline reason cannot exceed 500 characters",
  }),

  vehicleReSubmit: Joi.string(),

  // Vehicle Data
  make: Joi.string().max(30).messages({
    "string.max": "Make cannot exceed 30 characters",
  }),

  carType: Joi.string(),

  color: Joi.string().max(20).messages({
    "string.max": "Color cannot exceed 20 characters",
  }),

  year: Joi.string()
    .pattern(/^(19|20)\d{2}$/) // 1900-2099
    .messages({
      "string.pattern.base": "Year must be between 1900-2099",
    }),

  owner: Joi.string().max(50).messages({
    "string.max": "Owner name cannot exceed 50 characters",
  }),

  licensePlateNo: Joi.string().max(20).messages({
    "string.max": "Owner name cannot exceed 20 characters",
  }),

  feul: Joi.string()
    .valid("Petrol", "Diesel", "Electric", "Hybrid", "CNG")
    .messages({
      "any.only": "Invalid fuel type",
    }),

  seat: Joi.string()
    .pattern(/^[2-4]$/) // 2-4 seats
    .messages({
      "string.pattern.base": "Seats must be 2-4",
    }),

  transmission: Joi.string()
    .valid("Automatic", "Manual", "CVT", "Semi-Automatic", "EV")
    .messages({
      "any.only":
        "Transmission must be one of the following: Automatic, Manual, CVT, Semi-Automatic, or EV",
    }),
});


// For partial updates
const driverUpdateSchema = driverValidationSchema.fork(
  [
    'driverName',
    'driverContact',
    'driverCnic',
    'driverEmail',
    'licensePlateNo'
  ], 
  schema => schema.optional()
);

module.exports = {
  driverValidationSchema,
  driverUpdateSchema
};
