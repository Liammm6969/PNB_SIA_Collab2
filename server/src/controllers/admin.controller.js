const { StatusCodes } = require('http-status-codes');
const { UserService, TransactionService } = require('../services/index.js');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, transactions] = await Promise.all([
      UserService.listUsers(),
      TransactionService.getAllTransactions()
    ]);

    const stats = {
      totalUsers: users.length,
      totalTransactions: transactions.length,
      totalRevenue: transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0),
      securityAlerts: 0 // This would be calculated based on your security logic
    };

    res.status(StatusCodes.OK).json(stats);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get recent users (last 10 users)
exports.getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await UserService.getRecentUsers(limit);
    res.status(StatusCodes.OK).json(users);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get recent transactions (last 10 transactions)
exports.getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await TransactionService.getRecentTransactions(limit);
    res.status(StatusCodes.OK).json(transactions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
