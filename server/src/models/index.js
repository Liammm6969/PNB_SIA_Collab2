const PaymentModel = require('./payment.model');
const TransactionModel = require('./transaction.model');
const UserModel = require('./user.model');
const StaffModel = require('./staff.model');
const BeneficiaryModel = require('./beneficiary.model');
const DepositRequestModel = require('./depositRequest.model');
const BankReserveModel = require('./bankReserve.model');

module.exports = {
  Payment: PaymentModel,
  Transaction: TransactionModel,
  User: UserModel,
  Staff: StaffModel,
  Beneficiary: BeneficiaryModel,
  DepositRequest: DepositRequestModel,
  BankReserve: BankReserveModel
};