// Staff Service for Philippine National Bank SIA
// Base API URL for all staff-related endpoints
const BASE_URL = 'http://localhost:4000/api/Philippine-National-Bank/staff';

class StaffService {
  /**
   * Create a new staff member
   * @param {Object} staffData - Staff creation data
   * @param {string} staffData.firstName - Staff member's first name
   * @param {string} staffData.lastName - Staff member's last name
   * @param {string} staffData.department - Department ('Finance', 'Admin', or 'Loan')
   * @returns {Promise<Object>} Creation response
   */
  static async createStaff(staffData) {
    try {
      const response = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create staff member');
      }

      return {
        success: true,
        data: data,
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
   */
  static async getStaffById(staffId) {
    try {
      const response = await fetch(`${BASE_URL}/${staffId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch staff member');
      }

      return {
        success: true,
        data: data,
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
   */
  static async updateStaff(staffId, updateData) {
    try {
      const response = await fetch(`${BASE_URL}/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update staff member');
      }

      return {
        success: true,
        data: data,
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
   */
  static async deleteStaff(staffId) {
    try {
      const response = await fetch(`${BASE_URL}/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete staff member');
      }

      return {
        success: true,
        data: data,
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
   */
  static async getAllStaff() {
    try {
      const response = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch staff members');
      }

      return {
        success: true,
        data: data,
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
   */
  static async getStaffByDepartment(department) {
    try {
      const response = await fetch(`${BASE_URL}/department/${department}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch staff members by department');
      }

      return {
        success: true,
        data: data,
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