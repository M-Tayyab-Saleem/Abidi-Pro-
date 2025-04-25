const Joi = require('joi');

const zoneSchema = Joi.object({
  zoneName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Zone name must be at least 2 characters',
      'string.max': 'Zone name cannot exceed 50 characters',
      'any.required': 'Zone name is required'
    }),

  tripRequestVolume: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Trip request volume cannot be negative',
      'any.required': 'Trip request volume is required'
    }),

  extraFarePercentage: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'Extra fare percentage cannot be negative',
      'number.max': 'Extra fare percentage cannot exceed 100%',
      'any.required': 'Extra fare percentage is required'
    }),
});

const zoneUpdateSchema = zoneSchema.fork(
  ['zoneName', 'tripRequestVolume', 'extraFarePercentage'],
  schema => schema.optional()
);

module.exports = {
  zoneSchema,
  zoneUpdateSchema
};