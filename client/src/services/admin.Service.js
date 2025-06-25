// Admin Service for Philippine National Bank SIA
import api from './api.config.js';

// Base endpoint for all admin-related requests
const ADMIN_ENDPOINT = '/admin';

class AdminService {
  /**
   * Get dashboard statistics
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getDashboardStats(accessToken = null) {
    try {
      const config = {};
      
      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${ADMIN_ENDPOINT}/dashboard/stats`, config);
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  /**
   * Get recent users
   * @param {number} [limit] - Number of users to fetch (default: 10)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} Array of recent users
   */
  static async getRecentUsers(limit = 10, accessToken = null) {
    try {
      const config = {
        params: { limit }
      };
      
      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${ADMIN_ENDPOINT}/recent-users`, config);
      return response.data;
    } catch (error) {
      console.error('Get recent users error:', error);
      throw error;
    }
  }

  /**
   * Get recent transactions
   * @param {number} [limit] - Number of transactions to fetch (default: 10)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} Array of recent transactions
   */
  static async getRecentTransactions(limit = 10, accessToken = null) {
    try {
      const config = {
        params: { limit }
      };
      
      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${ADMIN_ENDPOINT}/recent-transactions`, config);
      return response.data;
    } catch (error) {
      console.error('Get recent transactions error:', error);
      throw error;
    }
  }
}

export default AdminService;
