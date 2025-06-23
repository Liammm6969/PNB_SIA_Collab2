const addPaymentSchema = require('./payment/add-payment.schema');
const addTransactionSchema = require('./transaction/add-transaction.schema');
const transferPaymentSchema = require('./payment/transfer-payment.schema');
const validateIdSchema = require('./user/validate-id.schema');
const validateUserIdSchema = require('./user/validate-user-id.schema');
const loginUserSchema = require('./user/login-user.schema');
const registerUserSchema = require('./user/register-user.schema');
const updateTransactionSchema = require('./transaction/update-transaction.schema');



module.exports = {
  addPaymentSchema,
  addTransactionSchema,
  transferPaymentSchema,
  validateIdSchema,
  validateUserIdSchema,
  loginUserSchema,
  registerUserSchema,
  updateTransactionSchema,

};