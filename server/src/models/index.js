const PaymentModel = require('./payment.model');
const TransactionModel = require('./transaction.model');
const UserModel = require('./user.model');
const StaffModel = require('./staff.model');

module.exports = {
  Payment: PaymentModel,
  Transaction: TransactionModel,
  User: UserModel,
  Staff: StaffModel
};