const {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} = require('../controllers/payment.controller');

const express = require('express');
const router = express.Router();

// Create a new payment
router.post('/', createPayment);
// Get all payments
router.get('/', getPayments);
// Get a payment by ID
router.get('/:id', getPaymentById);
// Update a payment by ID
router.put('/:id', updatePayment);
// Delete a payment by ID
router.delete('/:id', deletePayment);

module.exports = router;