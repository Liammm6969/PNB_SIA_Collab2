const express = require('express');
const router = express.Router();
const bankReserveController = require('../controllers/bankReserve.controller');
const { verifyAccessToken } = require('../middleware/index.js');
// Get current bank reserve

router.use(verifyAccessToken); // Ensure all routes are protected
router.get('/', bankReserveController.getBankReserve);

// Get bank reserve statistics
router.get('/stats', bankReserveController.getBankReserveStats);

// Update bank reserve balance (internal use)
router.patch('/update', bankReserveController.updateBankReserve);

// Check if bank has sufficient funds
router.post('/check-funds', bankReserveController.checkBankFunds);

// Initialize bank reserve (admin only)
router.post('/initialize', bankReserveController.initializeBankReserve);

module.exports = router;
