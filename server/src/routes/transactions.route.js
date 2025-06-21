const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware } = require('../middleware');
const { addTransactionSchema,
  validateIdSchema, validateUserIdSchema, updateTransactionSchema } = require('../schema');
const Roles = require('../lib/roles');

router.use(verifyAccessToken);
// Create a new transaction
router.post('/', ValidateRequestBodyMiddleware(addTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.createTransaction);

// Get all transactions for a user
router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionsByUser);

// Get a single transaction by ID
router.get('/transaction/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transactionsController.getTransactionById);

// Update transaction status
router.patch('/:id/status', ValidateRequestRouteParameterMiddleware(validateIdSchema), ValidateRequestBodyMiddleware(updateTransactionSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.updateTransactionStatus);

// Delete a transaction
router.delete('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transactionsController.deleteTransaction);

module.exports = router;