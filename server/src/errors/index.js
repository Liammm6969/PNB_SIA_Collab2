const DuplicateUserEmailError = require('./duplicate-user-email.error');
const InvalidPasswordError = require('./invalid-password.error');
const PaymentNotFoundError = require('./payment-not-found.error');
const TransactionNotFoundError = require('./transaction-not-found.error');
const UserNotFoundError = require('./user-not-found.error');
const OTPError = require("./otp.error")
module.exports = {
  DuplicateUserEmailError,
  InvalidPasswordError,
  PaymentNotFoundError,
  TransactionNotFoundError,
  UserNotFoundError,
  OTPError
};
