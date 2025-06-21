const addPaymentSchema = require('./add-payment.schema');
const addTransactionSchema = require('./add-transaction.schema');
const transferPaymentSchema = require('./transfer-payment.schema');
const validateIdSchema = require('./validate-id.schema');
const validateUserIdSchema = require('./validate-user-id.schema');
const loginUserSchema = require('./login-user.schema');
const registerUserSchema = require('./register-user.schema');
const updateTransactionSchema = require('./update-transaction.schema');


module.exports = {
  addPaymentSchema,
  addTransactionSchema,
  transferPaymentSchema,
  validateIdSchema,
  validateUserIdSchema,
  loginUserSchema,
  registerUserSchema,
  updateTransactionSchema
};