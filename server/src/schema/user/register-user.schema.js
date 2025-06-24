const joi = require('joi');

const registerUserSchema = joi.object({
  fullName: joi.string().alphanum()
    .min(5)
    .max(30).messages({
      'string.base': 'Full name must be a string',
      'string.empty': 'Full name cannot be empty',
      'string.min': 'Full name must be at least 5 characters long',
      'string.max': 'Full name must not exceed 30 characters',
      'any.required': 'Full name is required'
    }),
 
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org', 'edu'] }
  }).required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?]{8,30}$')).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.pattern.base': 'Password must be between 8 and 30 characters long and can contain letters, numbers, and special characters',
    'any.required': 'Password is required'
  }),
  accountNumber: joi.string().pattern(/^\d{3}-\d{4}-\d{3}-\d{4}$/).optional().messages({
    'string.base': 'Account number must be a string',
    'string.empty': 'Account number cannot be empty',
    'string.pattern.base': 'Account number must be in the format XXX-XXXX-XXX-XXXX',
  }),
 
 
  balance: joi.number().default(0).messages({
    'number.base': 'Balance must be a number',
    'any.default': 'Balance is set to 0 by default'
  }).optional(),

  accountType: joi.string().valid('personal', 'business').required().messages({
    'string.base': 'Account type must be a string',
    'any.only': 'Account type must be either personal or business',
    'any.required': 'Account type is required'
  })

});

module.exports = registerUserSchema;
