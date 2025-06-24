const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware, ApiLimiterMiddleware } = require('../middleware');
const { addTransactionSchema,
  validateTransactionIdSchema, validateUserIdSchema, updateTransactionSchema } = require('../schema');
const Roles = require('../lib/roles');


// router.use(verifyAccessToken);
// Create a new transaction
// router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.createTransaction);

router.post('/', transactionsController.createTransaction);

// Get all transactions for a user
// router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionsByUser);

router.get('/user/:userId', transactionsController.getTransactionsByUser)

// Get a single transaction by ID
// router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionById);

router.get('/transaction/:id', transactionsController.getTransactionById);

// Update the status of a transaction
// router.patch('/:id/status', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.updateTransactionStatus);

router.patch('/:id/status', transactionsController.updateTransactionStatus);

// Delete a transaction
// router.delete('/:id', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.deleteTransaction);

router.delete('/:id', transactionsController.deleteTransaction);


// Get all transactions
// router.get('/', ApiLimiterMiddleware, PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.getAllTransactions);

router.get('/', transactionsController.getAllTransactions);

// Withdraw transaction
router.post('/withdraw', transactionsController.withdrawMoney);

// Transfer money
// router.post('/transfer', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(transferSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.transferMoney);
router.post('/transfer', transactionsController.transferMoney);

module.exports = router;