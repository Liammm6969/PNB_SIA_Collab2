// filepath: d:\Repository\3rd Year Summer Reporsitories\PNB_SIA\client\src\service\user.Service.js

/**
 * User Service
 * Handles all user-related API operations including authentication,
 * registration, profile management, and OTP verification
 */

// API Configuration
const API_BASE_URL = 'http://192.168.9.23:4000/api/Philippine-National-Bank';
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
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.lastName - User's last name  
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} userData.accountType - Account type ('personal' or 'business')
   * @returns {Promise<Object>} Registration response
   */
  async registerUser(userData) {
    try {
      // Transform frontend form data to backend expected format
      const registrationData = {
        firstName: userData.accountType === 'personal' ? userData.firstName :undefined,
        lastName:  userData.accountType === 'personal' ? userData.lastName :undefined,
        companyName: userData.accountType === 'business' ? userData.companyName :undefined,
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

}

// Export singleton instance
const userService = new UserService();
export default userService;

// Named exports for specific methods
export const {
  registerUser,
  loginUser
} = userService;