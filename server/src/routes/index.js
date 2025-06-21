const PaymentRoute = require('./payment.route');
const TransactionRoute = require('./transactions.route');
const UserRoute = require('./user.route');

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
    }
  });
});

router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `UP:${StatusCodes.OK}`,
    message: 'PNB Microservice is running'
  });
});

router.use('/payments', PaymentRoute);
router.use('/transactions', TransactionRoute);
router.use('/users', UserRoute);

module.exports = router;