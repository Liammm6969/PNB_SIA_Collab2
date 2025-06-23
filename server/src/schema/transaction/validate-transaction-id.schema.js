const joi = require('joi');


const validateTransactionIdSchema = joi.object({
  transactionId: joi.number().required().messages({
    'number.base': 'Transaction ID must be a number',
    'number.empty': 'Transaction ID cannot be empty',
    'any.required': 'Transaction ID is required'
  })
});

module.exports = validateTransactionIdSchema;