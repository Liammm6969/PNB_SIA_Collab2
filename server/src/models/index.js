const PaymentModel = require('./payment.model');
const TransactionModel = require('./transaction.model');
const UserModel = require('./user.model');

module.exports = {
 Payment: PaymentModel,
  Transaction: TransactionModel,
  User: UserModel
};