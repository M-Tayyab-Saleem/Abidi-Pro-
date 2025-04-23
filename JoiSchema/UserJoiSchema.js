const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least 8 characters, including one letter, one number, and one special character',
      'any.required': 'Password is required'
    }),

  role: Joi.string(),
    // .valid('admin', 'dispatcher', 'driver', 'passenger', 'accountant')
    // .messages({
    //   'any.only': 'Invalid role specified'
    // }),

  otp: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    }),

  otpExpires: Joi.date()
    .messages({
      'date.base': 'Invalid OTP expiration date'
    }),

  customId: Joi.string(),

  contact: Joi.string()
    .pattern(/^((\+92)|(0092)|(92)|(0))?(3[0-9]{9})$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567)',
      'any.required': 'Contact number is required'
    }),

  assignedTrip: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid trip ID format'
    }),
    passwordResetToken: Joi.string(),
    
    passwordResetExpires: Joi.date().messages({
      'date.base': 'Invalid passwordResetExpires expiration date'
    }),
    refreshToken: Joi.string(),
});



const userUpdateSchema = userSchema.fork(
  ['email', 'password', 'otp', 'otpExpires', 'customId'],
  schema => schema.optional()
);

module.exports = {
  userSchema,
  userUpdateSchema
};