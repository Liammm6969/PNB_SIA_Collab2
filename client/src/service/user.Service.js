// filepath: d:\Repository\3rd Year Summer Reporsitories\PNB_SIA\client\src\service\user.Service.js

/**
 * User Service
 * Handles all user-related API operations including authentication,
 * registration, profile management, and OTP verification
 */

// API Configuration
const HOST = "localhost";
const PORT = "4000";
// const API_BASE_URL = `http://${HOST}:${PORT}/api/Philippine-National-Bank`;
const API_BASE_URL = `http://${HOST}:${PORT}/api/Philippine-National-Bank`;
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

/**
 * HTTP Request Helper
 * Centralized function to handle API requests with proper headers and error handling
 */
const apiRequest = async (url, options = {}) => {
  try {
    // Get access token from localStorage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * UserService Class
 * Contains all user-related operations
 */
class UserService {
    /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - User's first name (required for personal accounts)
   * @param {string} userData.lastName - User's last name (required for personal accounts)
   * @param {string} userData.businessName - Business name (required for business accounts)
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} userData.accountType - Account type ('personal' or 'business')
   * @returns {Promise<Object>} Registration response
   */async registerUser(userData) {
    try {
      // Transform frontend form data to backend expected format
      const registrationData = {
        firstName: userData.accountType === 'personal' ? userData.firstName : undefined,
        lastName: userData.accountType === 'personal' ? userData.lastName : undefined,
        businessName: userData.accountType === 'business' ? userData.businessName : undefined,
        email: userData.email,
        password: userData.password,
        accountType: userData.accountType,
      };

      const response = await apiRequest(`${USERS_ENDPOINT}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });

      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Login user (Step 1 - sends OTP to email)
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Login response with OTP message
   */
  async loginUser(credentials) {
    try {
      const response = await apiRequest(`${USERS_ENDPOINT}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Get user profile by userId
   * @param {number|string} userId
   * @returns {Promise<Object>} User profile object
   */
  async getUserProfile(userId) {
    try {
      const response = await apiRequest(`${USERS_ENDPOINT}/${userId}`, {
        method: 'GET',
      });
      // The backend may return an array or object, handle both
      if (Array.isArray(response)) {
        return response[0];
      }
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
  async getAllUsers() {
    try {
      const response = await apiRequest(`${USERS_ENDPOINT}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Create a new user (admin)
   * @param {Object} userData
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      // Use /register endpoint for user creation
      const response = await apiRequest(`${USERS_ENDPOINT}/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Update a user (admin)
   * @param {string|number} userId
   * @param {Object} userData
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiRequest(`${USERS_ENDPOINT}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Delete a user (admin)
   * @param {string|number} userId
   * @returns {Promise<Object>} Delete response
   */
  async deleteUser(userId) {
    try {
      const response = await apiRequest(`${USERS_ENDPOINT}/${userId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

}

// Export singleton instance
const userService = new UserService();
export default userService;

// Named exports for specific methods
export const {
  registerUser,
  loginUser
} = userService;