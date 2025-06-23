const joi = require('joi');


const addTransactionSchema = joi.object({
  fromUser: joi.number().required().messages({
    'number.base': 'From User must be a number',
    'any.required': 'From User is required'
  }),
  toUser: joi.number().required().messages({
    'number.base': 'To User must be a number',
    'any.required': 'To User is required'
  }),
  amount: joi.number().greater(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.greater': 'Amount must be greater than 0',
    'any.required': 'Amount is required'
  }),
  details: joi.string().required().messages({
    'string.empty': 'Details cannot be empty',
    'any.required': 'Details are required'
  }),
  balanceAfterPayment: joi.number().required().messages({
    'number.base': 'Balance After Payment must be a number',
    'any.required': 'Balance After Payment is required'
  }),
  date: joi.date().default(Date.now).messages({
    'date.base': 'Date must be a valid date'
  })
});

module.exports = addTransactionSchema;
