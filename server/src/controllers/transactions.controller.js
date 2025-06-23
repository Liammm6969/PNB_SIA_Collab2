const { StatusCodes } = require('http-status-codes');
const TransactionService = require("../services/transactions.service");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(StatusCodes.CREATED).json(transaction);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get all transactions for a user
exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await TransactionService.getTransactionsByUser(userId);
    res.status(StatusCodes.OK).json(transactions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message })
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await TransactionService.getTransactionById(transactionId);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const transaction = await TransactionService.updateTransactionStatus(transactionId, status);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await TransactionService.deleteTransaction(transactionId);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};