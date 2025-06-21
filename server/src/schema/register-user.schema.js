const joi = require('joi');

const registerUserSchema = joi.object({
  fullName: joi.string().alphanum()
    .min(5)
    .max(30)
    .required().messages({
      'string.base': 'Full name must be a string',
      'string.empty': 'Full name cannot be empty',
      'string.min': 'Full name must be at least 5 characters long',
      'string.max': 'Full name must not exceed 30 characters',
      'any.required': 'Full name is required'
    }),
  email: joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?]{3,30}$')).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.pattern.base': 'Password must be between 3 and 30 characters long and can contain letters, numbers, and special characters',
    'any.required': 'Password is required'
  }),
  accountNumber: joi.string().pattern(/^\d{3}-\d{4}-\d{3}-\d{4}$/).optional().messages({
    'string.base': 'Account number must be a string',
    'string.empty': 'Account number cannot be empty',
    'string.pattern.base': 'Account number must be in the format XXX-XXXX-XXX-XXXX',
  }),
  role: joi.string().valid('Admin', 'Finance', 'User').default('User'),
  address: joi.string().optional(),
  dateOfBirth: joi.date().max('12-31-2025').optional(),
  withdrawalMethods: joi.array().items(
    joi.object({
      type: joi.string().required(),
      cardNumber: joi.string().required(),
      local: joi.boolean().required()
    })
  ).optional()
});

module.exports = registerUserSchema;
