const mongoose = require("mongoose");
const { Transaction, User, Payment } = require("../models/index.js");
const { TransactionNotFoundError, UserNotFoundError } = require("../errors/index.js");
const BeneficiaryService = require("./beneficiary.service.js");
const BankReserveService = require('./bankReserve.service');
class TransactionService {
  constructor() {
    this.createTransaction = this.createTransaction.bind(this);
    this.getTransactionsByUser = this.getTransactionsByUser.bind(this);
    this.getTransactionById = this.getTransactionById.bind(this);
    this.updateTransactionStatus = this.updateTransactionStatus.bind(this);
    this.deleteTransaction = this.deleteTransaction.bind(this);
    this.getAllTransactions = this.getAllTransactions.bind(this);
    this.withdrawTransaction = this.withdrawTransaction.bind(this);
    this.transferMoney = this.transferMoney.bind(this);
    
  }

  async getAllTransactions() {
    try {
      const transactions = await Transaction.find().sort({ createdAt: -1 });
      return transactions;
    } catch (err) {
      throw err;
    }
  }

  async getRecentTransactions(limit = 10) {
    try {
      const transactions = await Transaction.find()
        .populate('fromUser', 'firstName lastName businessName accountType userId')
        .populate('toUser', 'firstName lastName businessName accountType userId')
        .sort({ createdAt: -1 })
        .limit(limit);
      return transactions;
    } catch (err) {
      throw err;
    }
  }

  async withdrawTransaction(userId, amount) {
    try {
      const user = await User.findOne({ userId: userId });
      if (!user) throw new UserNotFoundError('User not found');

      if (user.balance < amount) {
        throw new Error('Insufficient balance');
      }
      const deductAmountFromUser = await User.findOneAndUpdate(
        { userId: userId },
        { $inc: { balance: -amount } },
        { new: true }
      );
      return {
        updatedBalance: deductAmountFromUser.balance
      };
    } catch (error) {
      throw error;
    }
  }
  async createTransaction(transactionData) {
    try {
      const user = await User.findOne({ userId: transactionData.userId });
      if (!user) throw new TransactionNotFoundError('User not found');
      const addAmountToUser = await User.findOneAndUpdate(
        { userId: transactionData.userId },
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
      const transactions = await Transaction.find({ 
        $or: [
          { fromUser: userId },
          { toUser: userId }
        ]
      }).sort({ createdAt: -1 });
      if (!transactions || transactions.length === 0) {
        return []; // Return empty array instead of throwing error
      }
      return transactions;
    } catch (err) {
      throw err;
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await Transaction.findOne({ transactionId });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async updateTransactionStatus(transactionId, status) {
    try {
      const transaction = await Transaction.findOneAndUpdate({ transactionId }, { status }, { new: true });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return transaction;
    } catch (err) {
      throw err;
    }
  }

  async deleteTransaction(transactionId) {
    try {
      const transaction = await Transaction.findOneAndDelete({ transactionId });
      if (!transaction) throw new TransactionNotFoundError('Transaction not found');
      return { message: 'Transaction deleted' };
    } catch (err) {
      throw err;
    }
  }
  async transferMoney(transferData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { fromUser, toUser, amount, details } = transferData;
      console.log(transferData);
      
      // Search by either userId or accountNumber
      const senderDoc = await User.findOne({ 
        $or: [
          { userId: fromUser },
          { accountNumber: fromUser }
        ]
      }).session(session);
      
      const receiverDoc = await User.findOne({ 
        $or: [
          { userId: toUser },
          { accountNumber: toUser }
        ]
      }).session(session);
      
      if (!receiverDoc) throw new Error('Receiver not found');
      if (!senderDoc) throw new Error('Sender not found');
      if (senderDoc.balance < amount) throw new Error('Sender does not have enough balance');

      // Validate that bank has sufficient total reserves
      // (This is an optional check - transfers don't change total bank reserves 
      // but we want to ensure the system is within safe limits)
      const bankReserve = await BankReserveService.getBankReserve();
      const totalUserBalances = await User.aggregate([
        { $group: { _id: null, total: { $sum: '$balance' } } }
      ]);
      const currentTotalUserBalance = totalUserBalances[0]?.total || 0;
      
      if (currentTotalUserBalance > bankReserve.total_balance) {
        console.warn('Warning: Total user balances exceed bank reserves!');
        // For now we'll allow it but log the warning
        // In a real system, you might want to block this
      }

      // Use the actual _id for updates to ensure we update the correct user
      const sender = await User.findOneAndUpdate({
        _id: senderDoc._id,
        balance: { $gte: amount }
      }, {
        $inc: { balance: -amount }
      }, {
        new: true,
        session
      });

      await User.findOneAndUpdate(
        { _id: receiverDoc._id },
        { $inc: { balance: amount } },
        { new: true, session }
      );      const payment = new Payment({
        fromUser: senderDoc.userIdSeq,
        toUser: receiverDoc.userIdSeq,
        amount,
        details,
        balanceAfterPayment: sender.balance
      });      await payment.save({ session });
      
      // Update beneficiary last used if exists
      try {
        await BeneficiaryService.updateLastUsed(senderDoc.userIdSeq, receiverDoc.accountNumber);
      } catch (beneficiaryError) {
        console.warn('Could not update beneficiary last used:', beneficiaryError.message);
      }
      
      await session.commitTransaction();
      return {
        message: 'Transfer successful',
        payment,
        sender: {
          name: senderDoc.displayName?.fullName || 'Unknown',
          accountNumber: senderDoc.accountNumber,
          newBalance: sender.balance
        },
        receiver: {
          name: receiverDoc.displayName?.fullName || 'Unknown',
          accountNumber: receiverDoc.accountNumber
        }
      };} catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

  };
}

module.exports = new TransactionService();