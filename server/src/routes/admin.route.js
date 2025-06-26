const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const { verifyAccessToken } = require('../middleware/index.js');



// Admin dashboard endpoints
// router.use(PermissionMiddleware(Roles.ADMIN)); // Uncomment when authentication is enabled
router.use(verifyAccessToken);
// Get dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Get recent users
router.get('/recent-users', adminController.getRecentUsers);

// Get recent transactions
router.get('/recent-transactions', adminController.getRecentTransactions);

module.exports = router;
