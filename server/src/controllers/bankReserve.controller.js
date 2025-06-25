const { StatusCodes } = require('http-status-codes');
const BankReserveService = require('../services/bankReserve.service');

/**
 * Get current bank reserve balance
 * GET /api/bank/reserve
 */
exports.getBankReserve = async (req, res) => {
  try {
    const bankReserve = await BankReserveService.getBankReserve();
    res.status(StatusCodes.OK).json({
      success: true,
      data: bankReserve
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Update bank reserve balance (Internal use - called by other services)
 * PATCH /api/bank/reserve/update
 */
exports.updateBankReserve = async (req, res) => {
  try {
    const { amount, transactionType, transactionId } = req.body;

    if (!amount || !transactionType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Amount and transaction type are required'
      });
    }

    const validTypes = ['deposit', 'withdrawal', 'transfer'];
    if (!validTypes.includes(transactionType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Invalid transaction type. Must be: deposit, withdrawal, or transfer'
      });
    }

    const updatedReserve = await BankReserveService.updateReserveBalance(
      amount, 
      transactionType, 
      transactionId
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank reserve updated successfully',
      data: updatedReserve
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Check if bank has sufficient funds
 * POST /api/bank/reserve/check-funds
 */
exports.checkBankFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Valid amount is required'
      });
    }

    const hasFunds = await BankReserveService.checkSufficientFunds(amount);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        amount_requested: amount,
        sufficient_funds: hasFunds
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Initialize bank reserve (Admin only)
 * POST /api/bank/reserve/initialize
 */
exports.initializeBankReserve = async (req, res) => {
  try {
    const { initialAmount = 1000000 } = req.body;

    if (initialAmount < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Initial amount must be positive'
      });
    }

    const bankReserve = await BankReserveService.initializeBankReserve(initialAmount);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Bank reserve initialized successfully',
      data: bankReserve
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Get bank reserve statistics
 * GET /api/bank/reserve/stats
 */
exports.getBankReserveStats = async (req, res) => {
  try {
    const stats = await BankReserveService.getBankReserveStats();
    res.status(StatusCodes.OK).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false,
      error: error.message 
    });
  }
};
