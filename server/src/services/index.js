const PaymentService = require('./payment.service');
const TransactionService = require('./transactions.service');
const UserService = require('./user.service');
const TransferService = require('./transfer.service');
const StaffService = require('./staff.service');
const BeneficiaryService = require('./beneficiary.service');
const BankReserveService = require('./bankReserve.service');

module.exports = {
  PaymentService,
  TransactionService,
  UserService,
  TransferService,
  StaffService,
  BeneficiaryService,
  BankReserveService
};