const joi = require('joi');

const loginUserSchema = joi.object({
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org', 'edu'] }
  }).required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required'
  }),
  password: joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is required'
  })
});

module.exports = loginUserSchema;