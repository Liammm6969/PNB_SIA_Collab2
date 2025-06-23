const joi = require('joi');

const addPaymentSchema = joi.object({
 fromUser:joi.number().required().messages({
    'number.base': 'From User must be a number',
    'any.required': 'From User is required'
 }),
  toUser: joi.number().required().messages({
    'number.base': 'To User must be a number',
    'any.required': 'To User is required'
  }),
  amount: joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be at least 0',
    'any.required': 'Amount is required'
  }),
  details: joi.string().optional().messages({
    'string.base': 'Details must be a string'
  }),
  recipientType: joi.string().valid('User', 'Business').required().messages({
    'string.base': 'Recipient type must be a string',
    'any.only': 'Recipient type must be User or Business',
    'any.required': 'Recipient type is required'
  }),
});

module.exports = addPaymentSchema;
