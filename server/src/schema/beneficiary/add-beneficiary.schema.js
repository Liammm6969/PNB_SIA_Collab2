const joi = require('joi');

const addBeneficiarySchema = joi.object({
  userId: joi.number().required().messages({
    'number.base': 'User ID must be a number',
    'any.required': 'User ID is required'
  }),
  accountNumber: joi.string().pattern(/^\d{3}-\d{4}-\d{3}-\d{4}$/).required().messages({
    'string.base': 'Account number must be a string',
    'string.pattern.base': 'Account number must be in the format XXX-XXXX-XXX-XXXX',
    'any.required': 'Account number is required'
  }),
  nickname: joi.string().min(1).max(50).required().messages({
    'string.base': 'Nickname must be a string',
    'string.min': 'Nickname must be at least 1 character long',
    'string.max': 'Nickname must not exceed 50 characters',
    'any.required': 'Nickname is required'
  }),
  name: joi.string().min(1).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  accountType: joi.string().valid('personal', 'business').default('personal').messages({
    'string.base': 'Account type must be a string',
    'any.only': 'Account type must be either personal or business'
  }),
  isFavorite: joi.boolean().default(false).messages({
    'boolean.base': 'isFavorite must be a boolean'
  })
});

module.exports = addBeneficiarySchema;
