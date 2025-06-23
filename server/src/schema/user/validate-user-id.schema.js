const joi = require('joi');

const validateUserIdSchema = joi.object({
  userId: joi.number().required().messages({
    'number.base': 'User ID must be a number',
    'number.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required'
  })
});

module.exports = validateUserIdSchema;
