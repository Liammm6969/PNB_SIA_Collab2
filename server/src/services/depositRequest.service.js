const { DepositRequest, User, Payment } = require('../models');
const mongoose = require('mongoose');
const BankReserveService = require('./bankReserve.service');
const {UserNotFoundError} = require('../errors');

class DepositRequestService {
  constructor() {
    this.createDepositRequest = this.createDepositRequest.bind(this);
    this.getDepositRequestsByUser = this.getDepositRequestsByUser.bind(this);
    this.getAllDepositRequests = this.getAllDepositRequests.bind(this);
    this.getDepositRequestById = this.getDepositRequestById.bind(this);
    this.approveDepositRequest = this.approveDepositRequest.bind(this);
    this.rejectDepositRequest = this.rejectDepositRequest.bind(this);
  }

  // Create a new deposit request
  async createDepositRequest(userId, amount, note = '') {
    try {
      // Get user data
      const user = await User.findOne({ userId });
      if (!user) throw new UserNotFoundError('User not found');
      
      // Create deposit request
      const depositRequest = new DepositRequest({
        userId: user.userId,
        userIdSeq: user.userIdSeq,
        amount: parseFloat(amount),
        note: note.trim()
      });

      await depositRequest.save();

      return {
        success: true,
        message: 'Deposit request created successfully',
        depositRequest: {
          id: depositRequest.depositRequestStringId,
          amount: depositRequest.amount,
          note: depositRequest.note,
          status: depositRequest.status,
          createdAt: depositRequest.createdAt
        }
      };
    } catch (error) {
      throw new Error(`Failed to create deposit request: ${error.message}`);
    }
  }

  // Get deposit requests for a specific user
  async getDepositRequestsByUser(userId, limit = 10, status = null) {
    try {
      // Get user data
      const user = await User.findOne({ userId });
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      // Build query
      const query = { userIdSeq: user.userIdSeq };
      if (status) {
        query.status = status;
      }

      const depositRequests = await DepositRequest.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return depositRequests.map(request => ({
        id: request.depositRequestStringId,
        amount: request.amount,
        note: request.note,
        status: request.status,
        rejectionReason: request.rejectionReason,
        createdAt: request.createdAt,
        processedAt: request.processedAt
      }));
    } catch (error) {
      throw new Error(`Failed to get deposit requests: ${error.message}`);
    }
  }

  // Get all deposit requests (for Finance staff)
  async getAllDepositRequests(status = null, limit = 50) {
    try {
      const query = {};
      if (status) {
        query.status = status;
      }

      const depositRequests = await DepositRequest.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      // Get user details for each request
      const enrichedRequests = await Promise.all(
        depositRequests.map(async (request) => {
          const user = await User.findOne({ userIdSeq: request.userIdSeq }).lean();
          
          return {
            id: request.depositRequestStringId,
            requestId: request.depositRequestId,
            userId: request.userId,
            userIdSeq: request.userIdSeq,
            customerName: user ? (user.accountType === 'business' ? user.businessName : `${user.firstName} ${user.lastName}`) : 'Unknown User',
            accountNumber: user ? user.accountNumber : 'Unknown',
            accountType: user ? user.accountType : 'Unknown',
            amount: request.amount,
            note: request.note,
            status: request.status,
            rejectionReason: request.rejectionReason,
            processedBy: request.processedBy,
            createdAt: request.createdAt,
            processedAt: request.processedAt
          };
        })
      );

      return enrichedRequests;
    } catch (error) {
      throw new Error(`Failed to get all deposit requests: ${error.message}`);
    }
  }

  // Get specific deposit request by ID
  async getDepositRequestById(depositRequestId) {
    try {
      const depositRequest = await DepositRequest.findOne({
        depositRequestStringId: depositRequestId
      }).lean();

      if (!depositRequest) {
        throw new Error('Deposit request not found');
      }

      // Get user details
      const user = await User.findOne({ userIdSeq: depositRequest.userIdSeq }).lean();

      return {
        id: depositRequest.depositRequestStringId,
        requestId: depositRequest.depositRequestId,
        userId: depositRequest.userId,
        userIdSeq: depositRequest.userIdSeq,
        customerName: user ? (user.accountType === 'business' ? user.businessName : `${user.firstName} ${user.lastName}`) : 'Unknown User',
        accountNumber: user ? user.accountNumber : 'Unknown',
        accountType: user ? user.accountType : 'Unknown',
        amount: depositRequest.amount,
        note: depositRequest.note,
        status: depositRequest.status,
        rejectionReason: depositRequest.rejectionReason,
        processedBy: depositRequest.processedBy,
        createdAt: depositRequest.createdAt,
        processedAt: depositRequest.processedAt
      };
    } catch (error) {
      throw new Error(`Failed to get deposit request: ${error.message}`);
    }
  }
  // Approve deposit request
  async approveDepositRequest(depositRequestId, staffId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get deposit request
      const depositRequest = await DepositRequest.findOne({
        depositRequestStringId: depositRequestId
      }).session(session);

      if (!depositRequest) {
        throw new Error('Deposit request not found');
      }

      if (depositRequest.status !== 'Pending') {
        throw new Error('Deposit request has already been processed');
      }

      // Check if bank has sufficient funds for this deposit
      const hasSufficientFunds = await BankReserveService.checkSufficientFunds(depositRequest.amount);
      if (!hasSufficientFunds) {
        throw new Error('Insufficient bank reserve funds for this deposit');
      }

      // Get user
      const user = await User.findOne({ userIdSeq: depositRequest.userIdSeq }).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user balance
      const updatedUser = await User.findOneAndUpdate(
        { userIdSeq: depositRequest.userIdSeq },
        { $inc: { balance: depositRequest.amount } },
        { new: true, session }
      );

      // Create payment record
      const payment = new Payment({
        fromUser: 0, // System/External source
        toUser: depositRequest.userIdSeq,
        amount: depositRequest.amount,
        details: `Approved deposit request: ${depositRequest.note || 'Deposit request'}`,
        balanceAfterPayment: updatedUser.balance
      });

      await payment.save({ session });

      // Update deposit request status
      await DepositRequest.findOneAndUpdate(
        { depositRequestStringId: depositRequestId },
        {
          status: 'Approved',
          processedBy: staffId,
          processedAt: new Date()
        },
        { session }
      );

      // Update bank reserve (decrease by deposit amount)
      await BankReserveService.updateReserveBalance(
        -depositRequest.amount, 
        'deposit', 
        payment.paymentStringId || depositRequestId
      );

      await session.commitTransaction();

      return {
        success: true,
        message: 'Deposit request approved successfully',
        newBalance: updatedUser.balance,
        paymentId: payment.paymentStringId
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Failed to approve deposit request: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Reject deposit request
  async rejectDepositRequest(depositRequestId, staffId, rejectionReason = '') {
    try {
      const depositRequest = await DepositRequest.findOne({
        depositRequestStringId: depositRequestId
      });

      if (!depositRequest) {
        throw new Error('Deposit request not found');
      }

      if (depositRequest.status !== 'Pending') {
        throw new Error('Deposit request has already been processed');
      }

      // Update deposit request status
      await DepositRequest.findOneAndUpdate(
        { depositRequestStringId: depositRequestId },
        {
          status: 'Rejected',
          rejectionReason: rejectionReason.trim(),
          processedBy: staffId,
          processedAt: new Date()
        }
      );

      return {
        success: true,
        message: 'Deposit request rejected successfully'
      };
    } catch (error) {
      throw new Error(`Failed to reject deposit request: ${error.message}`);
    }
  }

  // Get deposit request statistics
  async getDepositRequestStats() {
    try {
      const stats = await DepositRequest.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      const result = {
        pending: { count: 0, totalAmount: 0 },
        approved: { count: 0, totalAmount: 0 },
        rejected: { count: 0, totalAmount: 0 }
      };

      stats.forEach(stat => {
        if (stat._id.toLowerCase() === 'pending') {
          result.pending = { count: stat.count, totalAmount: stat.totalAmount };
        } else if (stat._id.toLowerCase() === 'approved') {
          result.approved = { count: stat.count, totalAmount: stat.totalAmount };
        } else if (stat._id.toLowerCase() === 'rejected') {
          result.rejected = { count: stat.count, totalAmount: stat.totalAmount };
        }
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get deposit request statistics: ${error.message}`);
    }
  }
}

module.exports = new DepositRequestService();
