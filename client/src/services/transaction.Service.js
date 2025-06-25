// Transaction Service for Philippine National Bank SIA
import api from './api.config.js';

// Base endpoint for all transaction-related requests
const TRANSACTION_ENDPOINT = '/transactions';

class TransactionService {
  /**
   * Get user transactions by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Number of transactions to fetch
   * @param {number} [options.offset] - Number of transactions to skip
   * @param {string} [options.type] - Transaction type filter
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transactions response
   */  static async getUserTransactions(userId, options = {}, accessToken = null) {
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
      if (options.type) config.params.type = options.type;

      const response = await api.get(`${TRANSACTION_ENDPOINT}/user/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get user transactions error:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transaction data
   */  static async getTransactionById(transactionId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${TRANSACTION_ENDPOINT}/${transactionId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} transactionData.fromUserId - Sender user ID
   * @param {string} transactionData.toUserId - Recipient user ID
   * @param {number} transactionData.amount - Transaction amount
   * @param {string} transactionData.type - Transaction type
   * @param {string} [transactionData.description] - Transaction description
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transaction response
   */  static async createTransaction(transactionData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${TRANSACTION_ENDPOINT}/create`, transactionData, config);

      return response.data;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }

  /**
   * Get account balance for a user
   * @param {string} userId - User ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Balance data
   */  static async getAccountBalance(userId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${TRANSACTION_ENDPOINT}/balance/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  /**
   * Get transaction statistics for a user
   * @param {string} userId - User ID
   * @param {string} [period] - Period for statistics (month, year)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Statistics data
   */  static async getTransactionStats(userId, period = 'month', accessToken = null) {
    try {
      const config = {
        params: { period }
      };

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${TRANSACTION_ENDPOINT}/stats/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get transaction stats error:', error);
      throw error;
    }
  }
  /**
   * Get user statements (comprehensive transaction history)
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {string} [options.startDate] - Start date filter
   * @param {string} [options.endDate] - End date filter
   * @param {string} [options.type] - Transaction type filter
   * @param {string} [options.status] - Status filter
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Statements response
   */
  static async getUserStatements(userId, options = {}, accessToken = null) {
    try {
      const config = {
        params: {}
      };

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      if (options.startDate) config.params.startDate = options.startDate;
      if (options.endDate) config.params.endDate = options.endDate;
      if (options.type && options.type !== 'all') config.params.type = options.type;
      if (options.status && options.status !== 'all') config.params.status = options.status;

      const response = await api.get(`/payments/user-statements/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get user statements error:', error);
      throw error;
    }
  }

  /**
   * Get user payments by user ID (actual money transfers)
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Number of payments to fetch
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Payments response
   */static async getUserPayments(userId, options = {}, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };      }

      // Convert string userId to number for the API
      const numericUserId = typeof userId === 'string' && userId.includes('-') ? userId : userId;
      
      const response = await api.get(`/payments/user-payments/${numericUserId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get user payments error:', error);
      throw error;
    }
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} [currency] - Currency code (default: PHP)
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, currency = 'PHP') {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  static formatDate(date) {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }  /**
   * Transfer money between accounts
   * @param {Object} transferData - Transfer data
   * @param {string} transferData.fromUser - Sender account (userId or accountNumber)
   * @param {string} transferData.toUser - Recipient account (userId or accountNumber)
   * @param {number} transferData.amount - Transfer amount
   * @param {string} [transferData.details] - Transfer description
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Transfer response
   */
  static async transferMoney(transferData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.post(`${TRANSACTION_ENDPOINT}/transfer`, transferData, config);

      return response.data;
    } catch (error) {
      console.error('Transfer money error:', error);
      throw error;
    }
  }

  /**
   * Get transaction type display name
   * @param {string} type - Transaction type code
   * @returns {string} Display name
   */
  static getTransactionTypeDisplay(type) {
    const types = {
      'transfer': 'Transfer',
      'deposit': 'Deposit',
      'withdrawal': 'Withdrawal',
      'payment': 'Payment',
      'refund': 'Refund',
    };
    return types[type] || type;
  }

  /**
   * Get transaction status color class
   * @param {string} status - Transaction status
   * @returns {string} Bootstrap color class
   */
  static getStatusColorClass(status) {
    const statusColors = {
      'completed': 'success',
      'pending': 'warning',
      'failed': 'danger',
      'cancelled': 'secondary',
    };
    return statusColors[status] || 'secondary';
  }

  /**
   * Get all transactions (Finance/Admin only)
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Number of transactions to fetch
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} All transactions array
   */
  static async getAllTransactions(options = {}, accessToken = null) {
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

      const response = await api.get(TRANSACTION_ENDPOINT, config);

      return response.data;
    } catch (error) {
      console.error('Get all transactions error:', error);
      throw error;
    }
  }

  /**
   * Get all payments/transactions for finance dashboard
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Number of payments to fetch
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} All payments array
   */
  static async getAllPayments(options = {}, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get('/payments', config);

      return response.data;
    } catch (error) {
      console.error('Get all payments error:', error);
      throw error;
    }
  }
}

export default TransactionService;
