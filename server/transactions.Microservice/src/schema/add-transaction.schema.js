const joi = require('joi');


const addTransactionSchema = joi.object({
  userId: joi.string().required(),
  amount: joi.number().greater(0).required(),
  company: joi.string().required(),
  paymentDetails: joi.string().required(),
  status: joi.string().valid('Pending', 'Cancelled', 'Paid').default('Pending'),
});

module.exports = addTransactionSchema;
