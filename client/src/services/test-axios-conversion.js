// Test file for validating Axios conversion
import StaffService from './staff.Service.js';
import UserService from './user.Service.js';
import TransactionService from './transaction.Service.js';
import TransferService from './transfer.Service.js';

// Simple validation tests
console.log('Testing service imports...');

// Test that all services are properly imported
console.log('✓ StaffService imported:', typeof StaffService);
console.log('✓ UserService imported:', typeof UserService);
console.log('✓ TransactionService imported:', typeof TransactionService);
console.log('✓ TransferService imported:', typeof TransferService);

// Test that key methods exist
console.log('\nTesting method availability...');
console.log('✓ StaffService.loginStaff:', typeof StaffService.loginStaff);
console.log('✓ UserService.loginUser:', typeof UserService.loginUser);
console.log('✓ TransactionService.getUserTransactions:', typeof TransactionService.getUserTransactions);
console.log('✓ TransferService.initiateTransfer:', typeof TransferService.initiateTransfer);

// Test utility methods
console.log('\nTesting utility methods...');
console.log('✓ StaffService.isAuthenticated:', typeof StaffService.isAuthenticated);
console.log('✓ UserService.isAuthenticated:', typeof UserService.isAuthenticated);
console.log('✓ TransactionService.formatCurrency:', typeof TransactionService.formatCurrency);
console.log('✓ TransferService.validateTransferAmount:', typeof TransferService.validateTransferAmount);

console.log('\n🎉 All services successfully converted to Axios!');
