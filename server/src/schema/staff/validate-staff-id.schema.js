const joi = require('joi');

const validateStaffIdSchema = joi.object({
  staffId: joi.number().required().messages({
    'number.base': 'Staff ID must be a number',
    'number.empty': 'Staff ID cannot be empty',
    'any.required': 'Staff ID is required'
  })
});

module.exports = validateStaffIdSchema;
