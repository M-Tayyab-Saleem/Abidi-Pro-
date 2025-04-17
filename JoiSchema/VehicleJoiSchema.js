const Joi = require('joi');
const mongoose = require('mongoose');

const vehicleValidateSchema = Joi.object({
  driverId:  Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid driver ID format'
      }),

  vehicleID: Joi.string().optional(), // Auto-generated, so not required in input
  
  make: Joi.string().required().messages({
    'string.empty': 'Make is required',
    'any.required': 'Make is required'
  }),
  
  carType: Joi.string().required().messages({
    'string.empty': 'Car type is required',
    'any.required': 'Car type is required'
  }),
  
  color: Joi.string().required().messages({
    'string.empty': 'Color is required',
    'any.required': 'Color is required'
  }),
  
  year: Joi.string()
    .pattern(/^(19|20)\d{2}$/) // Validates years between 1900-2099
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid year (1900-2099)',
      'any.required': 'Year is required'
    }),
  
  owner: Joi.string().required().messages({
    'string.empty': 'Owner name is required',
    'any.required': 'Owner name is required'
  }),
  
  licensePlateNo: Joi.string()
    .required()
    .messages({
      'string.empty': 'License plate number is required',
      'any.required': 'License plate number is required'
    }),
  
    feul: Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid', 'cng')
    .required()
    .messages({
      'any.only': 'Fuel type must be one of petrol, diesel, electric, hybrid, or cng',
      'any.required': 'Fuel type is required'
    }),
  
  seat: Joi.string()
    .pattern(/^[2-9]$/) // Validates 2-9 seats
    .optional()
    .messages({
      'string.pattern.base': 'Seats must be a number between 2-9'
    }),
  
  transmission: Joi.string().valid('automatic', 'manual')
    .optional()
    .messages({
      'any.only': 'Transmission must be automatic or manual'
    }),
  
  vehicleDeclineReason: Joi.string().optional(),
  vehicleReSubmit: Joi.string().optional(),
  
  vehicleRegistrationBookFront: Joi.object({
      url: Joi.string().uri().allow(""),
      filename: Joi.string().allow(""),
    }),
  
  vehicleInsurance: Joi.object({
    url: Joi.string().uri().allow(''),
    filename: Joi.string().allow('')
  }).optional(),
  
  driver:  Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid driver ID format'
      }),
  
  status: Joi.string()
    .valid('available', 'assigned', 'maintenance', 'pending')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of available, assigned, maintenance, or pending'
    })
}).options({ abortEarly: false });

// Conditional validation for when status changes to 'available'
const vehicleUpdateValidate = (data, status) => {
  const schema = vehicleJoiSchema;
  
  if (status === 'available') {
    return schema.fork([
      'make',
      'carType',
      'color',
      'year',
      'owner',
      'licensePlateNo',
      'feul',
      'vehicleRegistrationBookFront'
    ], (field) => field.required()).validate(data);
  }
  
  return schema.validate(data);
};

module.exports = {
  vehicleValidateSchema,
  vehicleUpdateValidate
};