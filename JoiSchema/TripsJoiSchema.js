const Joi = require('joi');

const tripValidationSchema = Joi.object({
  tripID: Joi.string()
    .pattern(/^[A-Z0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Trip ID must be 8 alphanumeric characters',
    }),

  tripPassanger: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Passenger ID must be a valid MongoDB ID',
      'any.required': 'Passenger ID is required',
    }),

  scheduledDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'Scheduled date must be a valid ISO date string',
      'date.base': 'Scheduled date must be a valid date',
      'any.required': 'Scheduled date is required',
    }),

  tripFare: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'Fare must be a positive number',
      'number.base': 'Fare must be a number',
      'any.required': 'Fare is required',
    }),

  tripPaymentType: Joi.string().default('cash'),

  tripStatus: Joi.string().default('pending'),

  tripCurrentDate: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),

  tripDriver: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Driver ID must be a valid MongoDB ID',
    }),

  tripVehicleType: Joi.string()
    .required()
    .messages({
      'any.required': 'Vehicle type is required',
    }),
});

module.exports = tripValidationSchema;
