// Transfer Service for Philippine National Bank SIA
import api from './api.config.js';

// Base endpoint for all transfer-related requests
const TRANSFER_ENDPOINT = '/transfers';

class TransferService {
  /**
   * Initiate a transfer between accounts
   * @param {Object} transferData - Transfer data
   * @param {string} transferData.fromUserId - Sender user ID
   * @param {string} transferData.toAccountNumber - Recipient account number
   * @param {number} transferData.amount - Transfer amount
   * @param {string} [transferData.description] - Transfer description
   * @param {string} [transferData.type] - Transfer type (internal, external)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transfer response
   */  static async initiateTransfer(transferData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${TRANSFER_ENDPOINT}/initiate`, transferData, config);

      return response.data;
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  }

  /**
   * Validate recipient account number
   * @param {string} accountNumber - Account number to validate
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Validation response
   */  static async validateRecipient(accountNumber, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${TRANSFER_ENDPOINT}/validate-recipient`, { accountNumber }, config);

      return response.data;
    } catch (error) {
      console.error('Recipient validation error:', error);
      throw error;
    }
  }

  /**
   * Get transfer history for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Number of transfers to fetch
   * @param {number} [options.offset] - Number of transfers to skip
   * @param {string} [options.status] - Transfer status filter
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transfer history response
   */  static async getTransferHistory(userId, options = {}, accessToken = null) {
    try {
      const config = {
        params: {}
      };

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      if (options.limit) config.params.limit = options.limit;
      if (options.offset) config.params.offset = options.offset;
      if (options.status) config.params.status = options.status;

      const response = await api.get(`${TRANSFER_ENDPOINT}/history/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get transfer history error:', error);
      throw error;
    }
  }

  /**
   * Get transfer details by ID
   * @param {string} transferId - Transfer ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transfer details
   */  static async getTransferDetails(transferId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${TRANSFER_ENDPOINT}/${transferId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get transfer details error:', error);
      throw error;
    }
  }

  /**
   * Cancel a pending transfer
   * @param {string} transferId - Transfer ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Cancellation response
   */  static async cancelTransfer(transferId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.put(`${TRANSFER_ENDPOINT}/${transferId}/cancel`, {}, config);

      return response.data;
    } catch (error) {
      console.error('Cancel transfer error:', error);
      throw error;
    }
  }

  /**
   * Get saved beneficiaries for a user
   * @param {string} userId - User ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} List of beneficiaries
   */  static async getBeneficiaries(userId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${TRANSFER_ENDPOINT}/beneficiaries/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get beneficiaries error:', error);
      throw error;
    }
  }

  /**
   * Add a new beneficiary
   * @param {Object} beneficiaryData - Beneficiary data
   * @param {string} beneficiaryData.userId - User ID
   * @param {string} beneficiaryData.accountNumber - Beneficiary account number
   * @param {string} beneficiaryData.name - Beneficiary name
   * @param {string} [beneficiaryData.nickname] - Beneficiary nickname
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Add beneficiary response
   */  static async addBeneficiary(beneficiaryData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${TRANSFER_ENDPOINT}/beneficiaries`, beneficiaryData, config);

      return response.data;
    } catch (error) {
      console.error('Add beneficiary error:', error);
      throw error;
    }
  }

  /**
   * Validate transfer amount
   * @param {number} amount - Amount to validate
   * @param {number} balance - Account balance
   * @param {number} [dailyLimit] - Daily transfer limit
   * @returns {Object} Validation result
   */
  static validateTransferAmount(amount, balance, dailyLimit = 100000) {
    const errors = [];

    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than zero');
    }

    if (amount > balance) {
      errors.push('Insufficient balance');
    }

    if (amount > dailyLimit) {
      errors.push(`Amount exceeds daily limit of ₱${dailyLimit.toLocaleString()}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate account number format
   * @param {string} accountNumber - Account number to validate
   * @returns {Object} Validation result
   */  static validateAccountNumber(accountNumber) {
    const errors = [];

    if (!accountNumber) {
      errors.push('Account number is required');
    } else {
      // PNB account number format: XXX-XXXX-XXX-XXXX
      const accountRegex = /^\d{3}-\d{4}-\d{3}-\d{4}$/;
      if (!accountRegex.test(accountNumber)) {
        errors.push('Invalid account number format (XXX-XXXX-XXX-XXXX)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format account number for display
   * @param {string} accountNumber - Account number to format
   * @returns {string} Formatted account number
   */
  static formatAccountNumber(accountNumber) {
    if (!accountNumber) return '';
    
    // Remove any existing formatting
    const cleaned = accountNumber.replace(/\D/g, '');
    
    // Format as XXX-XXXX-XXX-XXXX
    if (cleaned.length === 14) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 10)}-${cleaned.slice(10, 14)}`;
    }
    
    return accountNumber;
  }

  /**
   * Calculate transfer fee
   * @param {number} amount - Transfer amount
   * @param {string} [type] - Transfer type (internal, external)
   * @returns {number} Transfer fee
   */
  static calculateTransferFee(amount, type = 'internal') {
    if (type === 'internal') {
      // Free for internal transfers
      return 0;
    } else {
      // External transfer fee: ₱15 for amounts up to ₱1000, ₱25 for higher amounts
      return amount <= 1000 ? 15 : 25;
    }
  }
}

export default TransferService;
