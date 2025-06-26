const joi = require('joi');

const addDepositSchema = joi.object({
  userId: joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required'
  }),

  amount: joi.number().positive().required().max(100000000).messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'number.max': 'Amount must not exceed 100 000 000',
    'any.required': 'Amount is required'
  }),

  note: joi.string().max(255).optional().messages({
    'string.base': 'Note must be a string',
    'string.max': 'Note must not exceed 255 characters'
  }),


});
module.exports = addDepositSchema;
