const joi = require('joi');

const validateBeneficiaryIdSchema = joi.object({
  beneficiaryId: joi.number().required().messages({
    'number.base': 'Beneficiary ID must be a number',
    'any.required': 'Beneficiary ID is required'
  })
});

module.exports = validateBeneficiaryIdSchema;
