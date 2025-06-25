import api from './api.config';

class BankReserveService {
  constructor() {
    this.BANK_RESERVE_ENDPOINT = '/bank/reserve';
  }

  /**
   * Get current bank reserve balance
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Bank reserve data
   */
  async getBankReserve(accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(this.BANK_RESERVE_ENDPOINT, config);
      return response.data;
    } catch (error) {
      console.error('Get bank reserve error:', error);
      throw error;
    }
  }

  /**
   * Get bank reserve statistics
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Bank reserve statistics
   */
  async getBankReserveStats(accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${this.BANK_RESERVE_ENDPOINT}/stats`, config);
      return response.data;
    } catch (error) {
      console.error('Get bank reserve stats error:', error);
      throw error;
    }
  }

  /**
   * Check if bank has sufficient funds for a transaction
   * @param {number} amount - Amount to check
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Funds availability data
   */
  async checkBankFunds(amount, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${this.BANK_RESERVE_ENDPOINT}/check-funds`, { amount }, config);
      return response.data;
    } catch (error) {
      console.error('Check bank funds error:', error);
      throw error;
    }
  }

  /**
   * Initialize bank reserve (Admin only)
   * @param {number} initialAmount - Initial amount to set
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Initialization result
   */
  async initializeBankReserve(initialAmount = 1000000, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${this.BANK_RESERVE_ENDPOINT}/initialize`, { initialAmount }, config);
      return response.data;
    } catch (error) {
      console.error('Initialize bank reserve error:', error);
      throw error;
    }
  }

  /**
   * Update bank reserve balance (Internal use)
   * @param {number} amount - Amount to add/subtract
   * @param {string} transactionType - Type of transaction
   * @param {string} transactionId - Reference transaction ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Update result
   */
  async updateBankReserve(amount, transactionType, transactionId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.patch(`${this.BANK_RESERVE_ENDPOINT}/update`, {
        amount,
        transactionType,
        transactionId
      }, config);
      return response.data;
    } catch (error) {
      console.error('Update bank reserve error:', error);
      throw error;
    }
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount || 0);
  }

  /**
   * Get reserve status color based on amount
   * @param {number} amount - Reserve amount
   * @returns {string} Bootstrap color class
   */
  static getReserveStatusColor(amount) {
    if (amount < 100000) return 'danger';
    if (amount < 500000) return 'warning';
    return 'success';
  }

  /**
   * Get reserve status text based on amount
   * @param {number} amount - Reserve amount
   * @returns {string} Status text
   */
  static getReserveStatusText(amount) {
    if (amount < 100000) return 'Critical';
    if (amount < 500000) return 'Low';
    if (amount < 1000000) return 'Moderate';
    return 'Healthy';
  }
}

export default BankReserveService;
