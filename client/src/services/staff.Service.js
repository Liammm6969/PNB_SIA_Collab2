// Staff Service for Philippine National Bank SIA
import api from './api.config.js';

// Base endpoint for all staff-related requests
const STAFF_ENDPOINT = '/staff';

class StaffService {  /**
   * Login staff member with staffStringId and password
   * @param {string} staffStringId - Staff string ID (e.g., STAFF_3000)
   * @param {string} password - Staff password
   * @returns {Promise<Object>} Login response with staff data and department info
   */  static async loginStaff(staffStringId, password) {
    try {
      const response = await api.post(`${STAFF_ENDPOINT}/login`, {
        staffStringId,
        password
      });

      return {
        success: true,
        data: response.data,
        message: 'Staff login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred during login'
      };
    }
  }

  /**
   * Logout staff by removing stored tokens
   */
  static logout() {
    localStorage.removeItem('staffId');
    localStorage.removeItem('staffEmail');
    localStorage.removeItem('staffDepartment');
    localStorage.removeItem('staffFirstName');
    localStorage.removeItem('staffLastName');
    localStorage.removeItem('staffStringId');
  }

  /**
   * Check if staff is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return !!localStorage.getItem('staffId');
  }

  /**
   * Store staff data in localStorage
   * @param {Object} staffData - Staff data to store
   */
  static setStaffData(staffData) {
    if (staffData.staffId) {
      localStorage.setItem('staffId', staffData.staffId);
    }
    if (staffData.email) {
      localStorage.setItem('staffEmail', staffData.email);
    }
    if (staffData.department) {
      localStorage.setItem('staffDepartment', staffData.department);
    }
    if (staffData.firstName) {
      localStorage.setItem('staffFirstName', staffData.firstName);
    }
    if (staffData.lastName) {
      localStorage.setItem('staffLastName', staffData.lastName);
    }
    if (staffData.staffStringId) {
      localStorage.setItem('staffStringId', staffData.staffStringId);
    }
  }

  /**
   * Get stored staff data
   * @returns {Object} Stored staff data
   */  static getStaffData() {
    return {
      staffId: localStorage.getItem('staffId'),
      staffEmail: localStorage.getItem('staffEmail'),
      staffDepartment: localStorage.getItem('staffDepartment'),
      staffFirstName: localStorage.getItem('staffFirstName'),
      staffLastName: localStorage.getItem('staffLastName'),
      staffStringId: localStorage.getItem('staffStringId'),
    };
  }

  /**
   * Get department-specific route based on department
   * @param {string} department - Department name
   * @returns {string} Route path
   */
  static getDepartmentRoute(department) {
    switch (department) {
      case 'Admin':
        return '/admin-dashboard';
      case 'Finance':
        return '/finance-dashboard';
      case 'Loan':
        return '/loans-dashboard';
      default:
        return '/admin-dashboard';
    }
  }

  /**
   * Get department theme colors
   * @param {string} department - Department name
   * @returns {Object} Theme colors for the department
   */
  static getDepartmentTheme(department) {
    switch (department) {
      case 'Admin':
        return {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          secondary: '#667eea',
          badge: 'primary'
        };
      case 'Finance':
        return {
          primary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          secondary: '#f093fb',
          badge: 'danger'
        };
      case 'Loan':
        return {
          primary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          secondary: '#4facfe',
          badge: 'info'
        };
      default:
        return {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          secondary: '#667eea',
          badge: 'primary'
        };
    }
  }

  /**
   * Create a new staff member
   * @param {Object} staffData - Staff creation data
   * @param {string} staffData.firstName - Staff member's first name
   * @param {string} staffData.lastName - Staff member's last name
   * @param {string} staffData.email - Staff member's email address
   * @param {string} staffData.password - Staff member's password
   * @param {string} staffData.department - Department ('Finance', 'Admin', or 'Loan')
   * @returns {Promise<Object>} Creation response
   */  static async createStaff(staffData) {
    try {
      const response = await api.post(`${STAFF_ENDPOINT}/`, staffData);

      return {
        success: true,
        data: response.data,
        message: 'Staff member created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while creating staff member'
      };
    }
  }

  /**
   * Get staff member by ID
   * @param {string|number} staffId - Staff ID
   * @returns {Promise<Object>} Staff member data
   */  static async getStaffById(staffId) {
    try {
      const response = await api.get(`${STAFF_ENDPOINT}/${staffId}`);

      return {
        success: true,
        data: response.data,
        message: 'Staff member retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while fetching staff member'
      };
    }
  }

  /**
   * Update staff member by ID
   * @param {string|number} staffId - Staff ID
   * @param {Object} updateData - Data to update
   * @param {string} [updateData.firstName] - Updated first name
   * @param {string} [updateData.lastName] - Updated last name
   * @param {string} [updateData.department] - Updated department
   * @returns {Promise<Object>} Update response
   */  static async updateStaff(staffId, updateData) {
    try {
      const response = await api.put(`${STAFF_ENDPOINT}/${staffId}`, updateData);

      return {
        success: true,
        data: response.data,
        message: 'Staff member updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while updating staff member'
      };
    }
  }

  /**
   * Delete staff member by ID
   * @param {string|number} staffId - Staff ID
   * @returns {Promise<Object>} Deletion response
   */  static async deleteStaff(staffId) {
    try {
      const response = await api.delete(`${STAFF_ENDPOINT}/${staffId}`);

      return {
        success: true,
        data: response.data,
        message: 'Staff member deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while deleting staff member'
      };
    }
  }

  /**
   * Get all staff members
   * @returns {Promise<Object>} All staff members data
   */  static async getAllStaff() {
    try {
      const response = await api.get(`${STAFF_ENDPOINT}/`);

      return {
        success: true,
        data: response.data,
        message: 'Staff members retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while fetching staff members'
      };
    }
  }

  /**
   * Get staff members by department
   * @param {string} department - Department name ('Finance', 'Admin', or 'Loan')
   * @returns {Promise<Object>} Staff members in the specified department
   */  static async getStaffByDepartment(department) {
    try {
      const response = await api.get(`${STAFF_ENDPOINT}/department/${department}`);

      return {
        success: true,
        data: response.data,
        message: `Staff members from ${department} department retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred while fetching staff members by department'
      };
    }
  }

  /**
   * Validate department name
   * @param {string} department - Department name to validate
   * @returns {boolean} True if valid department
   */
  static isValidDepartment(department) {
    const validDepartments = ['Finance', 'Admin', 'Loan'];
    return validDepartments.includes(department);
  }

  /**
   * Get list of valid departments
   * @returns {Array<string>} Array of valid department names
   */
  static getValidDepartments() {
    return ['Finance', 'Admin', 'Loan'];
  }
}

export default StaffService;