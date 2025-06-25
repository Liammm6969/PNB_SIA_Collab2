const PaymentRoute = require('./payment.route');
const TransactionRoute = require('./transactions.route');
const UserRoute = require('./user.route');
const StaffRoute = require('./staff.route');
const BeneficiaryRoute = require('./beneficiary.route');
const express = require('express');
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the PNB Microservice API',
    routes: {
      payments: 'http://localhost:4000/api/Philippine-National-Bank/payments',
      transactions: 'http://localhost:4000/api/Philippine-National-Bank/transactions',
      users: 'http://localhost:4000/api/Philippine-National-Bank/users',
      staff: 'http://localhost:4000/api/Philippine-National-Bank/staff',
      beneficiaries: 'http://localhost:4000/api/Philippine-National-Bank/beneficiaries',
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


module.exports = router;