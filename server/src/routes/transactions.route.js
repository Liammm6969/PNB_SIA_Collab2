const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware } = require('../middleware');
const { addTransactionSchema,
  validateIdSchema, validateUserIdSchema, updateTransactionSchema } = require('../schema');

router.use(verifyAccessToken);
// Create a new transaction
router.post('/', ValidateRequestBodyMiddleware(addTransactionSchema), PermissionMiddleware('create', 'transaction'), transactionsController.createTransaction);

// Get all transactions for a user
router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware('read', 'transaction', req => req.params.userId), transactionsController.getTransactionsByUser);

// Get a single transaction by ID
router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('read', 'transaction'), transactionsController.getTransactionById);

// Update transaction status
router.patch('/:id/status', ValidateRequestRouteParameterMiddleware(validateIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), PermissionMiddleware('update', 'transaction'), transactionsController.updateTransactionStatus);

// Delete a transaction
router.delete('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('delete', 'transaction'), transactionsController.deleteTransaction);

module.exports = router;