const addPaymentSchema = require('./payment/add-payment.schema');
const addTransactionSchema = require('./transaction/add-transaction.schema');
const transferPaymentSchema = require('./payment/transfer-payment.schema');
const validateTransactionIdSchema = require('./transaction/validate-transaction-id.schema');
const validateUserIdSchema = require('./user/validate-user-id.schema');
const validatePaymentIdSchema = require('./payment/validate-payment-id.schema');
const loginUserSchema = require('./user/login-user.schema');
const registerUserSchema = require('./user/register-user.schema');
const updateTransactionSchema = require('./transaction/update-transaction.schema');
const addStaffSchema = require('./staff/add-staff.schema');
const validateStaffIdSchema = require('./staff/validate-staff-id.schema');
const addBeneficiarySchema = require('./beneficiary/add-beneficiary.schema');
const validateBeneficiaryIdSchema = require('./beneficiary/validate-beneficiary-id.schema');
const validateAccountNumberSchema = require('./beneficiary/validate-account-number.schema');
const withdrawSchema = require('./transaction/withdraw.schema');

module.exports = {
  addPaymentSchema,
  addTransactionSchema,
  transferPaymentSchema,
  validateUserIdSchema,
  loginUserSchema,
  registerUserSchema,
  updateTransactionSchema,
  addStaffSchema,
  validateStaffIdSchema,
  validateTransactionIdSchema,
  validatePaymentIdSchema,
  addBeneficiarySchema,
  validateBeneficiaryIdSchema,
  validateAccountNumberSchema,
  withdrawSchema
};