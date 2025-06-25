import axios from 'axios';
import api from './api.config.js';

class DepositRequestService {
  constructor() {
    this.apiClient = api;
  }

  // Create a new deposit request
  async createDepositRequest(userId, amount, note = '') {
    try {
      const response = await this.apiClient.post('/deposit-requests', {
        userId,
        amount: parseFloat(amount),
        note: note.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating deposit request:', error);
      throw new Error(error.response?.data?.error || 'Failed to create deposit request');
    }
  }

  // Get deposit requests for a specific user
  async getDepositRequestsByUser(userId, limit = 10, status = null) {
    try {
      const params = { limit };
      if (status) params.status = status;

      const response = await this.apiClient.get(`/deposit-requests/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user deposit requests:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch deposit requests');
    }
  }

  // Get all deposit requests (for Finance staff)
  async getAllDepositRequests(status = null, limit = 50) {
    try {
      const params = { limit };
      if (status) params.status = status;

      const response = await this.apiClient.get('/deposit-requests', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all deposit requests:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch deposit requests');
    }
  }

  // Get specific deposit request by ID
  async getDepositRequestById(depositRequestId) {
    try {
      const response = await this.apiClient.get(`/deposit-requests/${depositRequestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deposit request:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch deposit request');
    }
  }

  // Approve deposit request (Finance staff only)
  async approveDepositRequest(depositRequestId, staffId) {
    try {
      const response = await this.apiClient.post(`/deposit-requests/${depositRequestId}/approve`, {
        staffId
      });
      return response.data;
    } catch (error) {
      console.error('Error approving deposit request:', error);
      throw new Error(error.response?.data?.error || 'Failed to approve deposit request');
    }
  }

  // Reject deposit request (Finance staff only)
  async rejectDepositRequest(depositRequestId, staffId, rejectionReason) {
    try {
      const response = await this.apiClient.post(`/deposit-requests/${depositRequestId}/reject`, {
        staffId,
        rejectionReason: rejectionReason.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting deposit request:', error);
      throw new Error(error.response?.data?.error || 'Failed to reject deposit request');
    }
  }

  // Get deposit request statistics (Finance staff only)
  async getDepositRequestStats() {
    try {
      const response = await this.apiClient.get('/deposit-requests/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching deposit request stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  }

  // Helper method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // Helper method to format date
  formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Helper method to get status badge color
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}

export default new DepositRequestService();
