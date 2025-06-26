const joi = require('joi');

const validateDepositIdSchema = joi.object({
  depositRequestId: joi.string().required().messages({
    'string.base': 'Deposit request ID must be a string',
    'any.required': 'Deposit request ID is required'
  })
});

module.exports = validateDepositIdSchema;