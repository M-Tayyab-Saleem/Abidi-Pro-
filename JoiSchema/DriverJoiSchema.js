const Joi = require("joi");
const { assign } = require("nodemailer/lib/shared");

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
      "string.pattern.base":
        "Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)",
      "any.required": "Contact number is required",
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

  // Required image validations
  driverProfilePic: Joi.object({
    url: Joi.string().uri().allow(""),
    filename: Joi.string().allow(""),
  }).optional(),

  driverCnicPicFront: Joi.object({
    url: Joi.string().uri().required().messages({
      "string.uri": "CNIC front image must be a valid URL",
      "any.required": "CNIC front image is required",
    }),
    filename: Joi.string().required().messages({
      "any.required": "CNIC front image filename is required",
    }),
  }),

  driverCnicPicBack: Joi.object({
    url: Joi.string().uri().required().messages({
      "string.uri": "CNIC back image must be a valid URL",
      "any.required": "CNIC back image is required",
    }),
    filename: Joi.string().required().messages({
      "any.required": "CNIC back image filename is required",
    }),
  }),

  driverLicensePicFront: Joi.object({
    url: Joi.string().uri().required().messages({
      "string.uri": "License front image must be a valid URL",
      "any.required": "License front image is required",
    }),
    filename: Joi.string().required().messages({
      "any.required": "License front image filename is required",
    }),
  }),

  driverLicensePicBack: Joi.object({
    url: Joi.string().uri().required().messages({
      "string.uri": "License back image must be a valid URL",
      "any.required": "License back image is required",
    }),
    filename: Joi.string().required().messages({
      "any.required": "License back image filename is required",
    }),
  }),

  // Decline Reasons
  driverDeclineReason: Joi.string().max(500).messages({
    "string.max": "Decline reason cannot exceed 500 characters",
  }),

  driverReSubmit: Joi.string(),
  assignedVehicle: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid trip ID format'
      })
});

// For partial updates
const driverUpdateSchema = driverValidationSchema.fork(
  [
    "driverName",
    "driverContact",
    "driverCnic",
    "driverEmail",
    "driverIban",
    "driverCnicPicFront",
    "driverCnicPicBack",
    "driverLicensePicFront",
    "driverLicensePicBack",
  ],
  (schema) => schema.optional()
);

module.exports = {
  driverValidationSchema,
  driverUpdateSchema,
};
