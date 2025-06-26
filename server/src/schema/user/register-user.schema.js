const joi = require('joi');

const registerUserSchema = joi.object({
  firstName: joi.string()
    .min(2)
    .max(30)
    .when('accountType', {
      is: 'personal',
      then: joi.required(),
      otherwise: joi.forbidden()
    })
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 30 characters',
      'any.required': 'First name is required for personal accounts'
    }),
    
  lastName: joi.string()
    .min(2)
    .max(30)
    .when('accountType', {
      is: 'personal',
      then: joi.required(),
      otherwise: joi.forbidden()
    })
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 30 characters',
      'any.required': 'Last name is required for personal accounts'
    }),

  businessName: joi.string()
    .min(2)
    .max(100)
    .when('accountType', {
      is: 'business',
      then: joi.required(),
      otherwise: joi.forbidden()
    })
    .messages({
      'string.base': 'Business name must be a string',
      'string.empty': 'Business name cannot be empty',
      'string.min': 'Business name must be at least 2 characters long',
      'string.max': 'Business name must not exceed 100 characters',
      'any.required': 'Business name is required for business accounts'
    }),

  accountType: joi.string().valid('personal', 'business').required().messages({
    'string.base': 'Account type must be a string',
    'any.only': 'Account type must be either personal or business',
    'any.required': 'Account type is required'
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
  }),
  dateOfBirth: joi.date().less('now').optional().messages({
    'date.base': 'Date of birth must be a valid date',
    'date.less': 'Date of birth must be in the past',
  }),

});

module.exports = registerUserSchema;
