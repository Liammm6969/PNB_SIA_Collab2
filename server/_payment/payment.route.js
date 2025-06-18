const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// Send money (B2B, P2P, B2P)
router.post('/send', paymentController.sendMoney);
// Transfer money (B2B, P2P, B2P)
router.post('/transfer', paymentController.transferMoney);

module.exports = router;
