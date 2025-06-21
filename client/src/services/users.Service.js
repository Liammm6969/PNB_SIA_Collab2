// const HOST_BASE = '192.168.9.23:4001';
const HOST_BASE = 'localhost:4000';
const API_PREFIX = '/api/Philippine-National-Bank';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`http://localhost:4000/api/Philippine-National-Bank/users/login`, {
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

