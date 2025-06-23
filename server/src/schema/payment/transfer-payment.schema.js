const joi = require('joi');

const transferPaymentSchema = joi.object({
  fromUser: joi.string().required().messages({
    'string.base': 'From User must be a string',
    'string.empty': 'From User cannot be empty',
    'any.required': 'From User is required'
  }),
  toUser: joi.string().required().messages({
    'string.base': 'To User must be a string',
    'string.empty': 'To User cannot be empty',
    'any.required': 'To User is required'
  }),
  amount: joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be at least 0',
    'any.required': 'Amount is required'
  }),
  details: joi.string().optional().messages({
    'string.base': 'Details must be a string'
  })
});

module.exports = transferPaymentSchema;