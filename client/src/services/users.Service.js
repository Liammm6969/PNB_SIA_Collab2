const HOST_BASE = '192.168.9.23:4000';
const API_PREFIX = '/api/Philippine-National-Bank';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const verifyOTP = async (email, otp) => {
  try {
    const url = `http://${HOST_BASE}${API_PREFIX}/users/verify-otp`;
    console.log('Attempting to verify OTP for:', email);
    console.log('Calling URL:', url);
    console.log('HOST_BASE:', HOST_BASE);
    console.log('API_PREFIX:', API_PREFIX);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    console.log('Response headers:', response.headers);
    console.log('Response URL:', response.url);

    if (!response.ok) {
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('OTP verification error response:', errorData);
        throw new Error(errorData.error || 'OTP verification failed');
      } else {
        // Handle non-JSON responses (HTML error pages)
        const textResponse = await response.text();
        console.error('Non-JSON error response (first 500 chars):', textResponse.substring(0, 500));
        throw new Error(`Server error (${response.status}): ${response.statusText}`);
      }
    }

    const result = await response.json();
    console.log('OTP verification successful:', result);
    return result;
  } catch (error) {
    console.error('OTP verification error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      url: `http://${HOST_BASE}${API_PREFIX}/users/verify-otp`
    });
    throw error;
  }
}

export const resendOTP = async (email, password) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to resend OTP');
    }
    return await response.json();
  } catch (error) {
    console.error('Resend OTP error:', error);
    throw error;
  }
}

export const getUsers = async () => {
  try {
    // Try to get token from 'pnb-token', 'token', or from 'pnb-user' in localStorage
    let token = localStorage.getItem('pnb-token') || localStorage.getItem('token');
    if (!token) {
      const userStr = localStorage.getItem('pnb-user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token || userObj.accessToken || '';
        } catch (e) {
          token = '';
        }
      }
    }
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData);
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {

      // Try to get detailed error message
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Registration error details:', errorData);
        throw new Error(errorData.error || errorData.message || `Registration failed with status: ${response.status}`);
      } else {
        // If no JSON response, get text response
        const textResponse = await response.text();
        console.error('Registration error (non-JSON):', textResponse.substring(0, 500));
        throw new Error(`Registration failed with status: ${response.status}`);

      }
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

export const getDashboardData = async (userId) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/${userId}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

export const getTransactionsByUser = async (userId) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/user-payments/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

// Alias for clarity in components that fetch payments
export const getPaymentsByUser = getTransactionsByUser;

export const getPaymentStatistics = async (userId) => {
  try {
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/payments/statistics/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    throw error;
  }
}

export const getBusinessAccounts = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/Philippine-National-Bank/business-accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching business accounts:', error);
    throw error;
  }
}

export const transferMoney = async ({ fromUser, toUser, amount, details, recipientType }) => {
  try {
    // Always include recipientType in the body if provided
    const body = { fromUser, toUser, amount, details };
    if (recipientType !== undefined) body.recipientType = recipientType;
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/payments/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('pnb-token')}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error('Transfer failed');
      }
      // If backend returns structured error, surface it
      const error = new Error(errorData.message || errorData.error || 'Transfer failed');
      if (errorData.name) error.name = errorData.name;
      if (errorData.errorCode) error.errorCode = errorData.errorCode;
      if (errorData.details) error.details = errorData.details;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Error transferring money:', error);
    throw error;
  }
}

export const findUserByEmailOrAccount = async (identifier) => {
  try {
    const users = await getUsers();
    if (!users || !Array.isArray(users)) throw new Error('No users found');
    let user;
    if (identifier.includes('@')) {
      user = users.find(u => u.email === identifier);
    } else {
      user = users.find(u => u.accountNumber === identifier);
    }
    if (!user) throw new Error('Recipient not found');
    return user;
  } catch (error) {
    if (error.message === 'Access denied') {
      throw new Error('You do not have permission to look up users. Please contact support.');
    }
    throw error;
  }
}