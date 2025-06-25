const { StatusCodes } = require('http-status-codes');
const { TransactionService } = require("../services/index.js");

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

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactions();
    res.status(StatusCodes.OK).json(transactions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
}

exports.withdrawMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const transaction = await TransactionService.withdrawTransaction(userId, amount);
    res.status(StatusCodes.OK).json(transaction);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

exports.transferMoney = async (req, res) => {
  try {
    const { fromUser, toUser, amount, details } = req.body;
    const transferData = { fromUser, toUser, amount, details };
    const transaction = await TransactionService.transferMoney(transferData);
    res.status(StatusCodes.CREATED).json(transaction);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};