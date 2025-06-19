const joi = require('joi');

const registerUserSchema = joi.object({
  fullName: joi.string().alphanum()
    .min(5)
    .max(30)
    .required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?]{3,30}$')).required(),
  address: joi.string().optional(),
  gender: joi.string().valid('Male', 'Female', 'Other').optional(),
  dateOfBirth: joi.date().max('12-31-2025').optional(),
  withdrawalMethods: joi.array().items(joi.string(), joi.number()).optional()
});

module.exports = registerUserSchema;
