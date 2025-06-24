const joi = require('joi');

const validateStaffSchema = joi.object({

  firstName: joi.string().min(2).max(100).required().messages({
    'string.base': 'First Name must be a string',
    'string.empty': 'First Name cannot be empty',
    'string.min': 'First Name must be at least 2 characters long',
    'string.max': 'First Name must be at most 100 characters long',
    'any.required': 'First Name is required'
  }),
  lastName: joi.string().min(2).max(100).required().messages({
    'string.base': 'Last Name must be a string',
    'string.empty': 'Last Name cannot be empty',
    'string.min': 'Last Name must be at least 2 characters long',
    'string.max': 'Last Name must be at most 100 characters long',
    'any.required': 'Last Name is required'
  }),
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org', 'edu'] }
  }).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  department: joi.string().valid("Finance", "Admin", "Loan").required().messages({
    'string.base': 'Department must be a string',
    'string.empty': 'Department cannot be empty',
    'any.required': 'Department is required',
    'string.valid': 'Department must be one of the following: Finance, Admin, Loan'
  })
});

module.exports = validateStaffSchema;
