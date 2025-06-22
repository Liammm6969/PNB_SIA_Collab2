const DuplicateUserEmailError = require('./user/duplicate-user-email.error');
const InvalidPasswordError = require('./user/invalid-password.error');
const PaymentNotFoundError = require('./payment/payment-not-found.error');
const TransactionNotFoundError = require('./transaction/transaction-not-found.error');
const UserNotFoundError = require('./user/user-not-found.error');
const OTPError = require("./user/otp.error")
const DuplicateCompanyNameError = require('./user/duplicate-companyname.error');
const DuplicateUserFullNameError = require('./user/duplicate-user-fullname.error');
module.exports = {
  DuplicateUserEmailError,
  InvalidPasswordError,
  PaymentNotFoundError,
  TransactionNotFoundError,
  UserNotFoundError,
  OTPError,
  DuplicateCompanyNameError,
  DuplicateUserFullNameError
};
