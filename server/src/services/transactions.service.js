const { Transaction, User } = require("../models/index.js");
const { TransactionNotFoundError } = require("../errors/index.js");
class TransactionService {
  constructor() {
    this.createTransaction = this.createTransaction.bind(this);
    this.getTransactionsByUser = this.getTransactionsByUser.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
    this.updateTransactionStatus = this.updateTransactionStatus.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
  }

  async createTransaction(transactionData) {
    try {
      const user = await User.find(transactionData.userId);
      if (!user) throw new TransactionNotFoundError('User not found');
      const addAmountToUser = await User.findOneAndUpdate(
        transactionData.userId,
        { $inc: { balance: transactionData.amount } },
        { new: true }
      );


      const transaction = new Transaction({
        userId: transactionData.userId,
        company: transactionData.company,
        paymentDetails: transactionData.paymentDetails,
        amount: addAmountToUser.balance,
        status: 'Pending',

      });
      await transaction.save();
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async getTransactionsByUser(userId) {
    try {
      const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
      if (!transactions) throw new TransactionNotFoundError('No transactions found');
      return transactions;
    } catch (err) {
      throw err;
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.find({ transactionId: id });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async updateTransactionStatus(id, status) {
    try {
      const transaction = await Transaction.findOneAndUpdate({ transactionId: id }, { status }, { new: true });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async deleteTransaction(id) {
    try {
      const transaction = await Transaction.findOneAndDelete({ transactionId: id });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return { message: 'Transaction deleted' };
    } catch (err) {
      throw err;
    }
  }
}


module.exports = new TransactionService();