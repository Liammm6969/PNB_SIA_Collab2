// User Service for Philippine National Bank SIA
// Base API URL for all user-related endpoints
const BASE_URL = 'http://localhost:4000/api/Philippine-National-Bank/users';

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
   */
  static async registerUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      return data;
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
   */
  static async loginUser(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
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
   */
  static async getUserProfile(userId, accessToken = null) {
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user profile');
      }

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * List all users (admin/testing purpose)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} Array of users
   */
  static async listUsers(accessToken = null) {
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('List users error:', error);
      throw error;
    }
  }

  /**
   * Logout user by removing stored tokens
   */
  static logout() {
    localStorage.removeItem('accessToken');
    // Clear any other user-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return !!localStorage.getItem('accessToken');
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
  }

  /**
   * Get stored user data
   * @returns {Object} Stored user data
   */
  static getUserData() {
    return {
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
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
}

export default UserService;