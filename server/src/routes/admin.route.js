const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const { PermissionMiddleware } = require('../middleware/index.js');
const Roles = require('../lib/roles.js');

// Admin dashboard endpoints
// router.use(PermissionMiddleware(Roles.ADMIN)); // Uncomment when authentication is enabled

// Get dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Get recent users
router.get('/recent-users', adminController.getRecentUsers);

// Get recent transactions
router.get('/recent-transactions', adminController.getRecentTransactions);

module.exports = router;
