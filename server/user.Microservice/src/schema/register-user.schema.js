const joi = require('joi');

const registerUserSchema = joi.object({
  fullName: joi.string().alphanum()
    .min(5)
    .max(30)
    .required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?]{3,30}$')).required(),
  accountNumber: joi.string().required(),
  role: joi.string().valid('Admin', 'Finance', 'User').default('User'),
  address: joi.string().optional(),
  dateOfBirth: joi.date().max('12-31-2025').optional(),
  withdrawalMethods: joi.array().items(
    joi.object({
      type: joi.string().required(),
      cardNumber: joi.string().required(),
      local: joi.boolean().required()
    })
  ).optional()
});

module.exports = registerUserSchema;
