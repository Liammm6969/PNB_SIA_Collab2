const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

// Create a new transaction
router.post('/', transactionsController.createTransaction);

// Get all transactions for a user
router.get('/user/:userId', transactionsController.getTransactionsByUser);

// Get a single transaction by ID
router.get('/:id', transactionsController.getTransactionById);

// Update transaction status
router.patch('/:id/status', transactionsController.updateTransactionStatus);

// Delete a transaction
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;