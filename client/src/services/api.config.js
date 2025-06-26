// API Configuration for Philippine National Bank SIA
import axios from 'axios';

// Base API URL
const BASE_API_URL = 'http://192.168.9.23:4000/api/Philippine-National-Bank';

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || 
                          error.response.data?.message || 
                          `Request failed with status ${error.response.status}`;
      error.message = errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Network error - please check your connection';
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred';
    }
    return Promise.reject(error);
  }
);

export default api;
