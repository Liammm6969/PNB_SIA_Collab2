import api from './api.config';

const BENEFICIARY_ENDPOINT = '/beneficiaries';

/**
 * Beneficiary Service for managing saved beneficiaries
 */
class BeneficiaryService {
  /**
   * Get saved beneficiaries for a user
   * @param {string|number} userId - User ID (can be userIdSeq number)
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Array>} List of beneficiaries
   */
  static async getBeneficiaries(userId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      // Convert string userId to number if needed
      const numericUserId = typeof userId === 'string' && userId.includes('-') 
        ? userId.split('-')[1] 
        : userId;
      
      const response = await api.get(`${BENEFICIARY_ENDPOINT}/user/${numericUserId}`, config);

      return response.data;
    } catch (error) {
      console.error('Get beneficiaries error:', error);
      throw error;
    }
  }

  /**
   * Add a new beneficiary
   * @param {Object} beneficiaryData - Beneficiary data
   * @param {string|number} beneficiaryData.userId - User ID
   * @param {string} beneficiaryData.accountNumber - Beneficiary account number
   * @param {string} beneficiaryData.nickname - Beneficiary nickname
   * @param {string} beneficiaryData.name - Beneficiary name
   * @param {string} [beneficiaryData.accountType] - Account type (personal/business)
   * @param {boolean} [beneficiaryData.isFavorite] - Is favorite beneficiary
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Add beneficiary response
   */
  static async addBeneficiary(beneficiaryData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      // Convert string userId to number if needed
      const processedData = {
        ...beneficiaryData,
        userId: typeof beneficiaryData.userId === 'string' && beneficiaryData.userId.includes('-') 
          ? parseInt(beneficiaryData.userId.split('-')[1])
          : parseInt(beneficiaryData.userId)
      };

      const response = await api.post(BENEFICIARY_ENDPOINT, processedData, config);

      return response.data;
    } catch (error) {
      console.error('Add beneficiary error:', error);
      throw error;
    }
  }

  /**
   * Update a beneficiary
   * @param {string|number} beneficiaryId - Beneficiary ID
   * @param {Object} updateData - Update data
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Update response
   */
  static async updateBeneficiary(beneficiaryId, updateData, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.put(`${BENEFICIARY_ENDPOINT}/${beneficiaryId}`, updateData, config);

      return response.data;
    } catch (error) {
      console.error('Update beneficiary error:', error);
      throw error;
    }
  }

  /**
   * Delete a beneficiary
   * @param {string|number} beneficiaryId - Beneficiary ID
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Delete response
   */
  static async deleteBeneficiary(beneficiaryId, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.delete(`${BENEFICIARY_ENDPOINT}/${beneficiaryId}`, config);

      return response.data;
    } catch (error) {
      console.error('Delete beneficiary error:', error);
      throw error;
    }
  }

  /**
   * Validate recipient account number
   * @param {string} accountNumber - Account number to validate
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Validation response
   */
  static async validateRecipient(accountNumber, accessToken = null) {
    try {
      const config = {};

      if (accessToken) {
        config.headers = {
          'Authorization': `Bearer ${accessToken}`
        };
      }

      const response = await api.get(`${BENEFICIARY_ENDPOINT}/validate/${accountNumber}`, config);

      return response.data;
    } catch (error) {
      console.error('Validate recipient error:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite status of a beneficiary
   * @param {string|number} beneficiaryId - Beneficiary ID
   * @param {boolean} isFavorite - New favorite status
   * @param {string} [accessToken] - Access token for authentication
   * @returns {Promise<Object>} Update response
   */
  static async toggleFavorite(beneficiaryId, isFavorite, accessToken = null) {
    return this.updateBeneficiary(beneficiaryId, { isFavorite }, accessToken);
  }
}

export default BeneficiaryService;
