const Joi = require('joi');

const vehicleValidateSchema = Joi.object({
  driverId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Invalid driver ID format'
    }),

  vehicleID: Joi.string().optional(),
  
  model: Joi.string().required().messages({
    'string.empty': 'Make is required',
    'any.required': 'Make is required'
  }),
  
  vehicleType: Joi.string().required().messages({
    'string.empty': 'Car type is required',
    'any.required': 'Car type is required'
  }),
  
  color: Joi.string().required().messages({
    'string.empty': 'Color is required',
    'any.required': 'Color is required'
  }),
  
  year: Joi.string()
    .pattern(/^(19|20)\d{2}$/)
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
  
  chassisNo: Joi.string()
    .required()
    .messages({
      'string.empty': 'Chassis number is required',
      'any.required': 'Chassis number is required'
    }),
  
  seat: Joi.string()
    .pattern(/^[2-9]$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Seats must be a number between 2-9'
    }),
  
  vehicleDeclineReason: Joi.string().allow(null, ''),
  vehicleReSubmit: Joi.string().allow(null, ''),
  
  vehicleFrontImage: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }),
  
  vehicleBackImage: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }),
  
  vehicleRightImage: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }),
  
  vehicleLeftImage: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }),
  
  vehicleRegistrationBookFront: Joi.object({
    url: Joi.string().uri().required(),
    filename: Joi.string().required()
  }),
  
  driver: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
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
  const schema = vehicleValidateSchema;
  
  if (status === 'available') {
    return schema.fork([
      'model',
      'vehicleType',
      'color',
      'year',
      'owner',
      'licensePlateNo',
      'chassisNo',
      'vehicleFrontImage',
      'vehicleBackImage',
      'vehicleRightImage',
      'vehicleLeftImage',
      'vehicleRegistrationBookFront'
    ], (field) => field.required()).validate(data);
  }
  
  return schema.validate(data);
};

module.exports = {
  vehicleValidateSchema,
  vehicleUpdateValidate
};