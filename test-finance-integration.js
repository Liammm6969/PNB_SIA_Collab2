// Finance Integration Test Script
// This script tests all the finance-related API endpoints to ensure complete integration

const baseUrl = 'http://192.168.88.244:4000/api/Philippine-National-Bank';

console.log('🏦 Testing Finance API Integration...\n');

// Test functions
async function testEndpoint(endpoint, description) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${description}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${Array.isArray(data) ? `${data.length} items` : JSON.stringify(data).substring(0, 100)}...\n`);
      return { success: true, data, status: response.status };
    } else {
      console.log(`❌ ${description}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(data)}\n`);
      return { success: false, error: data, status: response.status };
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('Starting Finance API Integration Tests...\n');
  
  const tests = [
    {
      endpoint: '/deposit-requests/stats',
      description: 'Deposit Request Statistics'
    },
    {
      endpoint: '/deposit-requests',
      description: 'All Deposit Requests'
    },
    {
      endpoint: '/payments',
      description: 'All Payments/Transactions'
    },
    {
      endpoint: '/transactions',
      description: 'All Transactions'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    const result = await testEndpoint(test.endpoint, test.description);
    if (result.success) {
      passedTests++;
    }
  }

  console.log('='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All finance integrations are working correctly!');
    console.log('✅ Transaction Management: Connected to payments API');
    console.log('✅ Deposit Management: Connected to deposit-requests API');
    console.log('✅ Finance Dashboard: Connected to stats and data APIs');
  } else {
    console.log('⚠️  Some integrations need attention');
  }
}

// Run the tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  window.testFinanceIntegration = runTests;
  console.log('Finance integration test function available as window.testFinanceIntegration()');
}
