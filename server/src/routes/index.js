const PaymentRoute = require('./payment.route');
const TransactionRoute = require('./transactions.route');
const UserRoute = require('./user.route');
const StaffRoute = require('./staff.route');
const BeneficiaryRoute = require('./beneficiary.route');
const DepositRequestRoute = require('./depositRequest.route');
const AdminRoute = require('./admin.route');
const BankReserveRoute = require('./bankReserve.route');
const express = require('express');
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the PNB Microservice API',
    routes: {
      payments: 'http://localhost:4000/api/Philippine-National-Bank/payments',
      transactions: 'http://localhost:4000/api/Philippine-National-Bank/transactions',
      users: 'http://localhost:4000/api/Philippine-National-Bank/users',      staff: 'http://localhost:4000/api/Philippine-National-Bank/staff',
      beneficiaries: 'http://localhost:4000/api/Philippine-National-Bank/beneficiaries',
      depositRequests: 'http://localhost:4000/api/Philippine-National-Bank/deposit-requests',
      admin: 'http://localhost:4000/api/Philippine-National-Bank/admin',
      bankReserve: 'http://localhost:4000/api/Philippine-National-Bank/bank/reserve',
    }
  });
});

router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `UP:${StatusCodes.OK}`,
    message: 'PNB is running'
  });
});

router.use('/payments', PaymentRoute);
router.use('/transactions', TransactionRoute);
router.use('/users', UserRoute);
router.use('/staff', StaffRoute);
router.use('/beneficiaries', BeneficiaryRoute);
router.use('/deposit-requests', DepositRequestRoute);
router.use('/admin', AdminRoute);
router.use('/bank/reserve', BankReserveRoute);
router.use('/bank/reserve', BankReserveRoute);
router.use('/bank/reserve', BankReserveRoute);


module.exports = router;