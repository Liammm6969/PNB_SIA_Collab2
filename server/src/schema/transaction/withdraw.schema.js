const joi = require('joi');

const withdrawSchema = joi.object({
    userId: joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'string.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required'
  }),
  amount: joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
})

module.exports = withdrawSchema