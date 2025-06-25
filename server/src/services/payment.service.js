const { Payment, User } = require("../models/index.js");
const {PaymentNotFoundError} = require("../errors/index.js");
class PaymentService {
  constructor() {
    this.createPayment = this.createPayment.bind(this);
    this.getPaymentsByUser = this.getPaymentsByUser.bind(this);
    this.getPaymentById = this.getPaymentById.bind(this);
    this.updatePaymentStatus = this.updatePaymentStatus.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
  }

  async createPayment(paymentData) {
    try {
      const payment = new Payment(paymentData);
      await payment.save();
      return payment;
    } catch (err) {
      throw err;
    }
  }  async getPaymentsByUser(userId) {
    try {
      let numericUserId;
      
      // Handle both numeric userIdSeq and full userId string
      if (typeof userId === 'number') {
        numericUserId = userId;
      } else if (typeof userId === 'string') {
        if (userId.includes('-')) {
          // Extract userIdSeq from full userId (e.g., "USER-1000" -> 1000)
          numericUserId = parseInt(userId.split('-')[1]);
        } else {
          // Parse string number
          numericUserId = parseInt(userId);
        }
      } else {
        return []; // Return empty array if invalid format
      }
      
      console.log('Looking for payments with userIdSeq:', numericUserId);
      
      const payments = await Payment.find({
        $or: [
          { fromUser: numericUserId },
          { toUser: numericUserId }
        ]
      }).sort({ createdAt: -1 });
      
      console.log('Found payments:', payments?.length || 0);
      
      return payments || [];
    } catch (err) {
      console.error('Error in getPaymentsByUser:', err);
      throw err;
    }
  }

  async getUserStatements(userId, filters = {}) {
    try {
      let numericUserId;
      
      // Handle both numeric userIdSeq and full userId string
      if (typeof userId === 'number') {
        numericUserId = userId;
      } else if (typeof userId === 'string') {
        if (userId.includes('-')) {
          // Extract userIdSeq from full userId (e.g., "USER-1000" -> 1000)
          numericUserId = parseInt(userId.split('-')[1]);
        } else {
          // Parse string number
          numericUserId = parseInt(userId);
        }
      } else {
        return []; // Return empty array if invalid format
      }

      // Build query
      let query = {
        $or: [
          { fromUser: numericUserId },
          { toUser: numericUserId }
        ]
      };

      // Apply date filters if provided
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }      const payments = await Payment.find(query)
        .sort({ createdAt: -1 });

      // Get user data for display names
      const currentUser = await this.getUserByNumericId(numericUserId);
      if (!currentUser) {
        throw new Error('Current user not found');
      }

      // Transform payments into statement format
      const statements = await Promise.all(payments.map(async (payment) => {
        // Get from and to user details
        const fromUser = await User.findOne({ userIdSeq: payment.fromUser });
        const toUser = await User.findOne({ userIdSeq: payment.toUser });
        
        const isReceiver = payment.toUser === numericUserId;
        const isSameUser = payment.fromUser === payment.toUser;
        
        let type, description, amount;
          if (isSameUser && payment.details && payment.details.toLowerCase().includes('withdrawal')) {
          type = 'withdrawal';
          description = payment.details || 'ATM Withdrawal';
          amount = -Math.abs(payment.amount);
        } else if (payment.fromUser === 0) {
          // External deposit (fromUser = 0 means system/external source)
          type = 'deposit';
          description = payment.details || 'Account Deposit';
          amount = Math.abs(payment.amount);
        } else if (isReceiver) {
          type = 'deposit';
          const senderName = fromUser ? 
            (fromUser.accountType === 'business' ? fromUser.businessName : `${fromUser.firstName} ${fromUser.lastName}`) : 
            'Unknown Sender';
          description = `Transfer from ${senderName}`;
          amount = Math.abs(payment.amount);
        } else {
          type = 'transfer';
          const receiverName = toUser ? 
            (toUser.accountType === 'business' ? toUser.businessName : `${toUser.firstName} ${toUser.lastName}`) : 
            'Unknown Recipient';
          description = `Transfer to ${receiverName}`;
          amount = -Math.abs(payment.amount);
        }

        return {
          id: payment.paymentStringId || payment._id.toString(),
          date: payment.createdAt,
          type: type,
          description: description,
          amount: amount,
          balance: payment.balanceAfterPayment || 0,
          status: 'completed', // Assuming all payments are completed
          reference: payment.paymentStringId || `PAY_${payment.paymentId}`,
          category: this.getCategoryFromType(type),
          fromUser: fromUser,
          toUser: toUser,
          originalPayment: payment
        };
      }));

      return statements;
    } catch (err) {
      console.error('Error in getUserStatements:', err);
      throw err;
    }
  }

  async getUserByNumericId(numericUserId) {
    try {
      return await User.findOne({ userIdSeq: numericUserId });
    } catch (err) {
      throw err;
    }
  }

  getCategoryFromType(type) {
    const categories = {
      'transfer': 'Transfer',
      'deposit': 'Income',
      'withdrawal': 'Cash',
      'payment': 'Payment'
    };
    return categories[type] || 'Other';
  }

  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.find({ paymentId });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return payment;
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentStatus(paymentId, status) {
    try {
      const payment = await Payment.findOneAndUpdate({ paymentId }, { status }, { new: true });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return payment;
    } catch (err) {
      throw err;
    }
  }
  async deletePayment(paymentId) {
    try {
      const payment = await Payment.findOneAndDelete({ paymentId });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return { message: 'Payment deleted' };
    } catch (err) {
      throw err;
    }
  }

  async createWithdrawal(userId, amount, details = 'ATM Withdrawal') {
    try {
      let numericUserId;
      
      // Handle both numeric userIdSeq and full userId string
      if (typeof userId === 'number') {
        numericUserId = userId;
      } else if (typeof userId === 'string') {
        if (userId.includes('-')) {
          numericUserId = parseInt(userId.split('-')[1]);
        } else {
          numericUserId = parseInt(userId);
        }
      } else {
        throw new Error('Invalid user ID format');
      }

      // Get user and check balance
      const user = await User.findOne({ userIdSeq: numericUserId });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Update user balance
      const updatedUser = await User.findOneAndUpdate(
        { userIdSeq: numericUserId },
        { $inc: { balance: -amount } },
        { new: true }
      );

      // Create payment record for withdrawal (fromUser and toUser are the same)
      const payment = new Payment({
        fromUser: numericUserId,
        toUser: numericUserId,
        amount: amount,
        details: details,
        balanceAfterPayment: updatedUser.balance
      });

      await payment.save();      return {
        payment,
        newBalance: updatedUser.balance,
        message: 'Withdrawal successful'
      };
    } catch (err) {
      throw err;
    }
  }

  async createDeposit(userId, amount, details = 'Account Deposit') {
    try {
      let numericUserId;
      
      // Handle both numeric userIdSeq and full userId string
      if (typeof userId === 'number') {
        numericUserId = userId;
      } else if (typeof userId === 'string') {
        if (userId.includes('-')) {
          numericUserId = parseInt(userId.split('-')[1]);
        } else {
          numericUserId = parseInt(userId);
        }
      } else {
        throw new Error('Invalid user ID format');
      }

      // Get user
      const user = await User.findOne({ userIdSeq: numericUserId });
      if (!user) {
        throw new Error('User not found');
      }

      // Update user balance
      const updatedUser = await User.findOneAndUpdate(
        { userIdSeq: numericUserId },
        { $inc: { balance: amount } },
        { new: true }
      );

      // Create payment record for deposit (external source to user)
      const payment = new Payment({
        fromUser: 0, // System/External source
        toUser: numericUserId,
        amount: amount,
        details: details,
        balanceAfterPayment: updatedUser.balance
      });

      await payment.save();

      return {
        payment,
        newBalance: updatedUser.balance,
        message: 'Deposit successful'
      };
    } catch (err) {
      throw err;
    }
  }
  async getAllPayments() {
    try {
      const payments = await Payment.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      
      // Enrich payments with user details
      const enrichedPayments = await Promise.all(payments.map(async (payment) => {
        let fromUserDetails = null;
        let toUserDetails = null;
        
        // Get sender details
        if (payment.fromUser === 0) {
          fromUserDetails = {
            accountNumber: 'SYSTEM',
            name: 'System',
            accountType: 'system'
          };
        } else {
          const fromUser = await User.findOne({ userIdSeq: payment.fromUser }).select('accountNumber firstName lastName businessName accountType').lean();
          if (fromUser) {
            fromUserDetails = {
              accountNumber: fromUser.accountNumber,
              name: fromUser.accountType === 'business' ? fromUser.businessName : `${fromUser.firstName} ${fromUser.lastName}`,
              accountType: fromUser.accountType
            };
          }
        }
        
        // Get receiver details
        const toUser = await User.findOne({ userIdSeq: payment.toUser }).select('accountNumber firstName lastName businessName accountType').lean();
        if (toUser) {
          toUserDetails = {
            accountNumber: toUser.accountNumber,
            name: toUser.accountType === 'business' ? toUser.businessName : `${toUser.firstName} ${toUser.lastName}`,
            accountType: toUser.accountType
          };
        }
        
        return {
          ...payment,
          fromUserDetails,
          toUserDetails
        };
      }));
      
      return enrichedPayments;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new PaymentService();