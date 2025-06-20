const {
  createPayment,
  getPayments,
  getPaymentById,
  transferPayment,
  deletePayment
} = require('../controllers/payment.controller');
const transferController = require('../controllers/transfer.controller');
const { addPaymentSchema,
  transferPaymentSchema,
  validateIdSchema,
  validateUserIdSchema } = require("../schema/index.js");

const {
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware } = require('../middleware/index.js');
const express = require('express');


const router = express.Router();

// Create a new payment
router.post('/', ValidateRequestBodyMiddleware(addPaymentSchema), createPayment);
// Get all payments
router.get('/user-payments/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), getPayments);
// Get a payment by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), getPaymentById);
// Update a payment by ID
router.put('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), transferPayment);
// Delete a payment by ID
router.delete('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), deletePayment);
// Transfer money between users
router.post('/transfer', ValidateRequestBodyMiddleware(transferPaymentSchema), transferController.transferMoney);

module.exports = router;