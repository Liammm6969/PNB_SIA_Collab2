const joi = require('joi');

const validateUserIdSchema = joi.object({
  userId: joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'string.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required'
  })
});

module.exports = validateUserIdSchema;
