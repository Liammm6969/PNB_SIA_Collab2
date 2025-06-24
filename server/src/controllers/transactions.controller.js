const { StatusCodes } = require('http-status-codes');
const {TransactionService} = require("../services/index.js");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { fromUser, toUser, amount, details, balanceAfterPayment } = req.body;
    const transaction = await TransactionService.createTransaction({
      fromUser,
      toUser,
      amount,
      details,
      balanceAfterPayment,
    });
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.getTransactionById(id);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transaction = await TransactionService.updateTransactionStatus(id, status);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.deleteTransaction(id);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};