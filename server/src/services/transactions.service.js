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
      const user = await User.findById(transactionData.userId);
      if (!user) throw new TransactionNotFoundError('User not found');
      const addAmountToUser = await User.findByIdAndUpdate(
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
      throw new Error(err.message);
    }
  }

  async getTransactionsByUser(userId) {
    try {
      const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
      if (!transactions) throw new TransactionNotFoundError('No transactions found');
      return transactions;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateTransactionStatus(id, status) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(id, { status }, { new: true });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteTransaction(id) {
    try {
      const transaction = await Transaction.findByIdAndDelete(id);
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return { message: 'Transaction deleted' };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}


module.exports = new TransactionService();