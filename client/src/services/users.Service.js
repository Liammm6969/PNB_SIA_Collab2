const HOST_BASE = 'localhost:4000';
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
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('token')}`,
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
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/users/register`, {
      method: 'POST',
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
    const response = await fetch(`http://${HOST_BASE}${API_PREFIX}/transactions/user/${userId}`, {
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

