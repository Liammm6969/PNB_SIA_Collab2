// Test script to verify User Service functionality
// Run this with: node test-user-service.js

const API_BASE_URL = 'http://192.168.9.23:4000/api/Philippine-National-Bank';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;

// Test user data
const testRegistrationData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  password: 'test123456',
  accountType: 'personal'
};

const testLoginData = {
  email: 'john.doe@test.com',
  password: 'test123456'
};

// API Request Helper
async function apiRequest(url, options = {}) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

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
}

// Test Registration
async function testRegistration() {
  try {
    console.log('🧪 Testing User Registration...');
    
    // Transform data to backend format
    const registrationData = {
      fullName: `${testRegistrationData.firstName} ${testRegistrationData.lastName}`,
      email: testRegistrationData.email,
      password: testRegistrationData.password,
      accountType: testRegistrationData.accountType,
      role: 'User',
      address: '',
      dateOfBirth: null,
      withdrawalMethods: 'Bank Transfer'
    };

    const response = await apiRequest(`${USERS_ENDPOINT}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });

    console.log('✅ Registration successful:', response);
    return response;
  } catch (error) {
    console.log('❌ Registration failed:', error.message);
    return null;
  }
}

// Test Login
async function testLogin() {
  try {
    console.log('🧪 Testing User Login...');
    
    const response = await apiRequest(`${USERS_ENDPOINT}/login`, {
      method: 'POST',
      body: JSON.stringify(testLoginData),
    });

    console.log('✅ Login successful:', response);
    return response;
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting User Service Tests\n');
  
  // Test registration
  const registrationResult = await testRegistration();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test login
  const loginResult = await testLogin();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📊 Test Summary:');
  console.log(`Registration: ${registrationResult ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Login: ${loginResult ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (loginResult && loginResult.message) {
    console.log('\n💡 Note: Login returns OTP message. In the UI, you would proceed to OTP verification.');
  }
}

runTests();
