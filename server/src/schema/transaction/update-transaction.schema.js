const joi = require('joi');

const updateTransactionSchema = joi.object({
  userId: joi.string().required().messages({
    'string.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required'
  }),
  amount: joi.number().greater(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.greater': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  company: joi.string().required().messages({
    'string.empty': 'Company cannot be empty',
    'any.required': 'Company is required'
  }),
  paymentDetails: joi.string().required().messages({
    'string.empty': 'Payment details cannot be empty',
    'any.required': 'Payment details are required'
  }),
  status: joi.string().valid('Pending', 'Cancelled', 'Paid').default('Pending').messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of Pending, Cancelled, or Paid',
    'any.required': 'Status is required'
  })
})

module.exports = updateTransactionSchema;