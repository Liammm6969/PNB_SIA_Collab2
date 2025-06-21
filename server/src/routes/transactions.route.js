const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken } = require('../middleware');
const { addTransactionSchema,
  validateIdSchema, validateUserIdSchema, updateTransactionSchema } = require('../schema');

router.use(verifyAccessToken);
// Create a new transaction
router.post('/', ValidateRequestBodyMiddleware(addTransactionSchema), transactionsController.createTransaction);

// Get all transactions for a user
router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), transactionsController.getTransactionsByUser);

// Get a single transaction by ID
router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), transactionsController.getTransactionById);

// Update transaction status
router.patch('/:id/status', ValidateRequestRouteParameterMiddleware(validateIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), transactionsController.updateTransactionStatus);

// Delete a transaction
router.delete('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), transactionsController.deleteTransaction);

module.exports = router;