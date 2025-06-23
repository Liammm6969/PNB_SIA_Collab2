const joi = require('joi');


const validatePaymentIdSchema = joi.object({
  paymentId: joi.number().required().messages({
    'number.base': 'Payment ID must be a number',
    'number.empty': 'Payment ID cannot be empty',
    'any.required': 'Payment ID is required'
  })
});

module.exports = validatePaymentIdSchema;