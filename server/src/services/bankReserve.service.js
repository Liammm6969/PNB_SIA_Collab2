const { BankReserve } = require('../models');

class BankReserveService {
  constructor() {
    this.getBankReserve = this.getBankReserve.bind(this);
    this.updateReserveBalance = this.updateReserveBalance.bind(this);
    this.checkSufficientFunds = this.checkSufficientFunds.bind(this);
    this.initializeBankReserve = this.initializeBankReserve.bind(this);
  }

  /**
   * Get the current bank reserve instance
   * @returns {Promise<Object>} Bank reserve data
   */
  async getBankReserve() {
    try {
      const bankReserve = await BankReserve.getInstance();
      return {
        id: bankReserve._id,
        total_balance: bankReserve.total_balance,
        last_transaction_id: bankReserve.last_transaction_id,
        last_transaction_amount: bankReserve.last_transaction_amount,
        last_transaction_type: bankReserve.last_transaction_type,
        updatedAt: bankReserve.updatedAt,
        createdAt: bankReserve.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to get bank reserve: ${error.message}`);
    }
  }

  /**
   * Update bank reserve balance
   * @param {number} amount - Amount to add/subtract (positive for deposits, negative for withdrawals)
   * @param {string} transactionType - Type of transaction ('deposit', 'withdrawal', 'transfer')
   * @param {string} transactionId - Reference transaction ID
   * @returns {Promise<Object>} Updated bank reserve
   */
  async updateReserveBalance(amount, transactionType, transactionId = null) {
    try {
      const bankReserve = await BankReserve.getInstance();
      
      // For withdrawals and transfers, check if sufficient funds exist
      if (amount < 0 && !bankReserve.hasSufficientFunds(Math.abs(amount))) {
        throw new Error('Insufficient bank reserve funds');
      }

      const updatedReserve = await bankReserve.updateBalance(amount, transactionType, transactionId);
      
      return {
        id: updatedReserve._id,
        total_balance: updatedReserve.total_balance,
        last_transaction_id: updatedReserve.last_transaction_id,
        last_transaction_amount: updatedReserve.last_transaction_amount,
        last_transaction_type: updatedReserve.last_transaction_type,
        updatedAt: updatedReserve.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to update bank reserve: ${error.message}`);
    }
  }

  /**
   * Check if bank has sufficient funds for a transaction
   * @param {number} amount - Amount to check
   * @returns {Promise<boolean>} Whether sufficient funds exist
   */
  async checkSufficientFunds(amount) {
    try {
      const bankReserve = await BankReserve.getInstance();
      return bankReserve.hasSufficientFunds(amount);
    } catch (error) {
      throw new Error(`Failed to check bank funds: ${error.message}`);
    }
  }

  /**
   * Initialize bank reserve with a specific amount (Admin only)
   * @param {number} initialAmount - Initial amount to set
   * @returns {Promise<Object>} Bank reserve data
   */
  async initializeBankReserve(initialAmount = 1000000) {
    try {
      // Delete existing reserve if any
      await BankReserve.deleteMany({});
      
      // Create new reserve
      const bankReserve = new BankReserve({
        total_balance: initialAmount,
        last_transaction_type: 'initialization',
        last_transaction_amount: initialAmount
      });
      
      await bankReserve.save();
      
      return {
        id: bankReserve._id,
        total_balance: bankReserve.total_balance,
        last_transaction_type: bankReserve.last_transaction_type,
        last_transaction_amount: bankReserve.last_transaction_amount,
        updatedAt: bankReserve.updatedAt,
        createdAt: bankReserve.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to initialize bank reserve: ${error.message}`);
    }
  }

  /**
   * Get bank reserve statistics and history
   * @returns {Promise<Object>} Bank reserve statistics
   */
  async getBankReserveStats() {
    try {
      const bankReserve = await BankReserve.getInstance();
      
      // You could add more complex stats here like daily changes, etc.
      return {
        current_balance: bankReserve.total_balance,
        last_transaction: {
          id: bankReserve.last_transaction_id,
          amount: bankReserve.last_transaction_amount,
          type: bankReserve.last_transaction_type,
          date: bankReserve.updatedAt
        },
        created_date: bankReserve.createdAt,
        last_updated: bankReserve.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to get bank reserve stats: ${error.message}`);
    }
  }
}

module.exports = new BankReserveService();
