const joi = require('joi');

const loginUserSchema = joi.object({
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org', 'edu'] }
  }).required(),
  password: joi.string().min(8).required()
});

module.exports = loginUserSchema;