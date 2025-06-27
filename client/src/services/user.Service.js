// User Service for Philippine National Bank SIA
import api from './api.config.js';

// Base endpoint for all user-related requests
const USER_ENDPOINT = '/users';

class UserService {
  /**
   * Register a new user (personal or business account)
   * @param {Object} userData - User registration data
   * @param {string} userData.accountType - 'personal' or 'business'
   * @param {string} userData.email - User email address
   * @param {string} userData.password - User password
   * @param {string} [userData.firstName] - First name (required for personal accounts)
   * @param {string} [userData.lastName] - Last name (required for personal accounts)
   * @param {string} [userData.businessName] - Business name (required for business accounts)
   * @param {string} [userData.accountNumber] - Account number (optional, format: XXX-XXXX-XXX-XXXX)
   * @param {number} [userData.balance] - Initial balance (defaults to 0)
   * @returns {Promise<Object>} Registration response
   */  static async registerUser(userData) {
    try {
      const response = await api.post(`${USER_ENDPOINT}/register`, userData);

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with message and userId
   */  static async loginUser(email, password) {
    try {
      const response = await api.post(`${USER_ENDPOINT}/login`, {
        email,
        password
      });

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  /**
   * Get user profile by user ID
   * @param {string} userId - User ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} User profile data
   */  static async getUserProfile(userId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${USER_ENDPOINT}/${userId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }
  /**
   * Get user by userIdSeq (for internal lookups)
   * @param {string|number} userIdSeq - User ID sequence number
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} User profile data
   */
  static async getUserByUserIdSeq(userIdSeq, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${USER_ENDPOINT}/seq/${userIdSeq}`, config);

      return response.data;
    } catch (error) {
      console.error('Get user by userIdSeq error:', error);
      throw error;
    }
  }

  /**
   * List all users (admin/testing purpose)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} Array of users
   */  static async listUsers(accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${USER_ENDPOINT}/`, config);

      return response.data;
    } catch (error) {
      console.error('List users error:', error);
      throw error;
    }
  }
  /**
   * Logout user by removing stored tokens
   */  static async logout() {

    const config = {};
    const accessToken = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId');
    if (accessToken) {
      config.headers = {
        'Authorization': `Bearer ${accessToken}`
      };
    }
    const response = await api.post(`${USER_ENDPOINT}/logout/${userId}`, config);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountNumber');


    return response.data;
  }
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    // Check for userId since the current system doesn't use access tokens
    return !!localStorage.getItem('userId');
  }

  /**
   * Get stored access token
   * @returns {string|null} Access token
   */
  static getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  /**
   * Store user data in localStorage
   * @param {Object} userData - User data to store
   */
  static setUserData(userData) {
    if (userData.userId || userData.id) {
      localStorage.setItem('userId', userData.userId || userData.id);
    }
    if (userData.email) {
      localStorage.setItem('userEmail', userData.email);
    }
    if (userData.accountNumber) {
      localStorage.setItem('accountNumber', userData.accountNumber);
    }
  }
  /**
   * Get stored user data
   * @returns {Object} Stored user data
   */
  static getUserData() {
    return {
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      accountNumber: localStorage.getItem('accountNumber'),
    };
  }

  /**
   * Helper method to create personal account registration data
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {Object} [options] - Additional options
   * @returns {Object} Personal account data
   */
  static createPersonalAccountData(firstName, lastName, email, password, options = {}) {
    return {
      accountType: 'personal',
      firstName,
      lastName,
      email,
      password,
      ...options,
    };
  }

  /**
   * Helper method to create business account registration data
   * @param {string} businessName - Business name
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {Object} [options] - Additional options
   * @returns {Object} Business account data
   */
  static createBusinessAccountData(businessName, email, password, options = {}) {
    return {
      accountType: 'business',
      businessName,
      email,
      password,
      ...options,
    };
  }

  /**
   * Verify OTP for user login
   * @param {string} email - User email
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} OTP verification response
   */
  static async verifyOTP(email, otp) {
    try {
      const response = await api.post(`${USER_ENDPOINT}/verify-otp`, { email, otp });
      return response.data;
    } catch (error) {
      console.log(email, otp)
      console.error('OTP verification error:', error);
      throw error;
    }
  }
}

export default UserService;