const {
  createPayment,
  getPayments,
  getPaymentById,
  transferPayment,
  deletePayment
} = require("../controllers/payment.controller.js");

const transferController = require('../controllers/transfer.controller');

const {
  addPaymentSchema,
  transferPaymentSchema,
  validateIdSchema,
  validateUserIdSchema
} = require("../schema/index.js");

const {
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware
} = require('../middleware/index.js');

const express = require('express');


const router = express.Router();

router.use(verifyAccessToken);
// Create a new payment
router.post('/', ValidateRequestBodyMiddleware(addPaymentSchema), PermissionMiddleware('create', 'payment'), createPayment);
// Get all payments
router.get('/user-payments/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware('read', 'payment', req => req.params.userId), getPayments);
// Get a payment by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('read', 'payment'), getPaymentById);
// Update a payment by ID
router.put('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('update', 'payment'), transferPayment);
// Delete a payment by ID
router.delete('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('delete', 'payment'), deletePayment);
// Transfer money between users
router.post('/transfer', ValidateRequestBodyMiddleware(transferPaymentSchema), PermissionMiddleware('create', 'payment'), transferController.transferMoney);

module.exports = router;