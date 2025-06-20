const joi = require('joi');

const validateUserIdSchema = joi.object({
  userId: joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
    'string.base': 'ID must be a string',
    'string.empty': 'ID cannot be empty',
    'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
    'any.required': 'ID is required'
  })
});

module.exports = validateUserIdSchema;
