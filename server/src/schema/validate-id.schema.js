const joi = require('joi');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const validateIdSchema = joi.object({
  id: joi.string().pattern(objectIdPattern).required().messages({
    'string.base': 'ID must be a string',
    'string.empty': 'ID cannot be empty',
    'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
    'any.required': 'ID is required'
  })
});

module.exports = validateIdSchema;