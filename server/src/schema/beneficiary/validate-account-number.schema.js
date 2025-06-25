const joi = require('joi');

const validateAccountNumberSchema = joi.object({
  accountNumber: joi.string().pattern(/^\d{3}-\d{4}-\d{3}-\d{4}$/).required().messages({
    'string.base': 'Account number must be a string',
    'string.pattern.base': 'Account number must be in the format XXX-XXXX-XXX-XXXX',
    'any.required': 'Account number is required'
  })
});

module.exports = validateAccountNumberSchema;
