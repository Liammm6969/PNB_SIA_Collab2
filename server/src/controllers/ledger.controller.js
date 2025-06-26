const { StatusCodes } = require('http-status-codes');
const { PaymentService, UserService } = require('../services/index.js');

/**
 * Get user ledger - comprehensive transaction log with running balance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserLedger = async (req, res) => {
  try {
    const { userId } = req.params;
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      type: req.query.type,
      search: req.query.search,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };

    // Get user data for context
    const userProfile = await UserService.getUserProfile(userId);
    if (!userProfile) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }

    // Get user's numeric ID for payment queries
    let numericUserId;
    if (typeof userId === 'string' && userId.includes('-')) {
      numericUserId = parseInt(userId.split('-')[1]);
    } else {
      numericUserId = parseInt(userId);
    }

    // Build query for payments
    let query = {
      $or: [
        { fromUser: numericUserId },
        { toUser: numericUserId }
      ]
    };

    // Apply date filters
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    // Get payments and sort by date
    const { Payment, User } = require('../models/index.js');
    const payments = await Payment.find(query)
      .sort({ createdAt: 1 }) // Sort ascending for running balance calculation
      .limit(filters.limit)
      .skip(filters.offset);

    // Transform payments to ledger entries with running balance
    let runningBalance = userProfile.balance || 0;
    const ledgerEntries = [];

    // Calculate initial balance (balance before the filtered transactions)
    if (payments.length > 0) {
      const firstPaymentDate = payments[0].createdAt;
      const paymentsBeforeFilter = await Payment.find({
        $or: [
          { fromUser: numericUserId },
          { toUser: numericUserId }
        ],
        createdAt: { $lt: firstPaymentDate }
      }).sort({ createdAt: 1 });

      // Calculate balance before the current filter period
      let balanceBeforeFilter = 0;
      for (const payment of paymentsBeforeFilter) {
        if (payment.toUser === numericUserId) {
          balanceBeforeFilter += payment.amount;
        } else if (payment.fromUser === numericUserId) {
          balanceBeforeFilter -= payment.amount;
        }
      }
      runningBalance = balanceBeforeFilter;
    }

    // Process each payment to create ledger entries
    for (const payment of payments) {
      let entryType, description, debitAmount = 0, creditAmount = 0;
      let relatedUser = null;

      const isReceiver = payment.toUser === numericUserId;
      const isSender = payment.fromUser === numericUserId;

      // Determine transaction type and amounts
      if (payment.fromUser === 0) {
        // System deposit
        entryType = 'deposit';
        creditAmount = payment.amount;
        description = payment.details || 'System Deposit';
        relatedUser = { name: 'System', accountNumber: 'SYSTEM' };
      } else if (isReceiver && !isSender) {
        // Incoming transfer
        entryType = 'transfer_in';
        creditAmount = payment.amount;
        const fromUser = await User.findOne({ userIdSeq: payment.fromUser });
        relatedUser = fromUser ? {
          name: fromUser.accountType === 'business' ? fromUser.businessName : `${fromUser.firstName} ${fromUser.lastName}`,
          accountNumber: fromUser.accountNumber
        } : { name: 'Unknown User', accountNumber: 'N/A' };
        description = payment.details || `Transfer from ${relatedUser.name}`;
      } else if (isSender && !isReceiver) {
        // Outgoing transfer
        entryType = 'transfer_out';
        debitAmount = payment.amount;
        const toUser = await User.findOne({ userIdSeq: payment.toUser });
        relatedUser = toUser ? {
          name: toUser.accountType === 'business' ? toUser.businessName : `${toUser.firstName} ${toUser.lastName}`,
          accountNumber: toUser.accountNumber
        } : { name: 'Unknown User', accountNumber: 'N/A' };
        description = payment.details || `Transfer to ${relatedUser.name}`;
      } else if (isSender && isReceiver) {
        // Self transaction (withdrawal/internal transfer)
        entryType = 'withdrawal';
        debitAmount = payment.amount;
        description = payment.details || 'ATM Withdrawal';
        relatedUser = { name: 'Self', accountNumber: userProfile.accountNumber };
      }

      // Update running balance
      runningBalance += (creditAmount - debitAmount);

      // Apply search filter if provided
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          description.toLowerCase().includes(searchLower) ||
          (relatedUser?.name || '').toLowerCase().includes(searchLower) ||
          entryType.toLowerCase().includes(searchLower) ||
          payment.paymentStringId?.toLowerCase().includes(searchLower);

        if (!matchesSearch) continue;
      }

      // Apply type filter
      if (filters.type && filters.type !== 'all' && entryType !== filters.type) {
        continue;
      }

      const ledgerEntry = {
        id: payment.paymentStringId || payment._id.toString(),
        date: payment.createdAt,
        description,
        debit: debitAmount > 0 ? debitAmount : null,
        credit: creditAmount > 0 ? creditAmount : null,
        balance: runningBalance,
        type: entryType,
        relatedUser,
        reference: payment.paymentStringId || `PAY_${payment.paymentId}`,
        sourceType: entryType.includes('transfer') ? 'transfer' : entryType,
        timestamp: payment.createdAt,
        resultingBalance: runningBalance,
        paymentId: payment.paymentId
      };

      ledgerEntries.push(ledgerEntry);
    }

    // Reverse to show most recent first
    ledgerEntries.reverse();

    // Calculate summary statistics
    const totalCredits = ledgerEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    const totalDebits = ledgerEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const currentBalance = userProfile.balance || 0;

    res.status(StatusCodes.OK).json({
      userId: userProfile.userId,
      accountNumber: userProfile.accountNumber,
      accountHolder: userProfile.accountType === 'business' ? 
        userProfile.businessName : 
        `${userProfile.firstName} ${userProfile.lastName}`,
      currentBalance,
      entries: ledgerEntries,
      summary: {
        totalEntries: ledgerEntries.length,
        totalCredits,
        totalDebits,
        netChange: totalCredits - totalDebits,
        currentBalance
      },
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: payments.length === filters.limit
      }
    });

  } catch (error) {
    console.error('Get user ledger error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      error: error.message || 'Failed to retrieve user ledger' 
    });
  }
};
