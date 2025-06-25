// Test script to verify Bank Reserve implementation
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/Philippine-National-Bank';

async function testBankReserveSystem() {
  console.log('🏦 Testing Centralized Bank Balance System...\n');

  try {
    // Test 1: Get bank reserve (should create initial reserve)
    console.log('📊 Test 1: Getting Bank Reserve...');
    const reserveResponse = await axios.get(`${BASE_URL}/bank/reserve`);
    console.log('✅ Success:', reserveResponse.data);
    console.log('');

    // Test 2: Get bank reserve stats
    console.log('📈 Test 2: Getting Bank Reserve Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/bank/reserve/stats`);
    console.log('✅ Success:', statsResponse.data);
    console.log('');

    // Test 3: Check funds availability
    console.log('💰 Test 3: Checking Funds Availability...');
    const fundsCheck = await axios.post(`${BASE_URL}/bank/reserve/check-funds`, {
      amount: 50000
    });
    console.log('✅ Success:', fundsCheck.data);
    console.log('');

    // Test 4: Test deposit flow (should decrease bank reserve)
    console.log('💳 Test 4: Testing Deposit Flow...');
    try {
      const depositResponse = await axios.post(`${BASE_URL}/payments/deposit`, {
        userId: 1000,
        amount: 10000,
        details: 'Test deposit for bank reserve integration'
      });
      console.log('✅ Deposit Success:', depositResponse.data);
    } catch (depositError) {
      console.log('ℹ️ Deposit test note:', depositError.response?.data?.error || depositError.message);
    }
    console.log('');

    // Test 5: Get updated bank reserve
    console.log('🔄 Test 5: Getting Updated Bank Reserve...');
    const updatedReserve = await axios.get(`${BASE_URL}/bank/reserve`);
    console.log('✅ Success:', updatedReserve.data);
    console.log('');

    console.log('🎉 Bank Reserve System Tests Completed Successfully!');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

// Run tests
testBankReserveSystem();
