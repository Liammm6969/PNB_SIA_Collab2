const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, ApiLimiterMiddleware } = require('../middleware');
const { addTransactionSchema,
  validateTransactionIdSchema, validateUserIdSchema, updateTransactionSchema, withdrawSchema } = require('../schema');


router.use(verifyAccessToken);
// Create a new transaction
// router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.createTransaction);

router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addTransactionSchema), transactionsController.createTransaction);

// Get all transactions for a user
// router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionsByUser);

router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), transactionsController.getTransactionsByUser)

// Get a single transaction by ID
// router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionById);

router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), transactionsController.getTransactionById);

// Update the status of a transaction
// router.patch('/:id/status', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.updateTransactionStatus);

router.patch('/:id/status', ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), transactionsController.updateTransactionStatus);

// Delete a transaction
// router.delete('/:id', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.deleteTransaction);

router.delete('/:id', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateTransactionIdSchema), transactionsController.deleteTransaction);


// Get all transactions
// router.get('/', ApiLimiterMiddleware, PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.getAllTransactions);

router.get('/', ApiLimiterMiddleware, transactionsController.getAllTransactions);

// Withdraw transaction
router.post('/withdraw', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(withdrawSchema), transactionsController.withdrawMoney);

// Transfer money
// router.post('/transfer', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(transferSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.transferMoney);
router.post('/transfer', ApiLimiterMiddleware, transactionsController.transferMoney);

module.exports = router;