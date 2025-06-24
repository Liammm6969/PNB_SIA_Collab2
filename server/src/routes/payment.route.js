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
  validatePaymentIdSchema,
  validateUserIdSchema
} = require("../schema/index.js");

const {
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware, ApiLimiterMiddleware
} = require('../middleware/index.js');
const Roles = require('../lib/roles.js');
const express = require('express');



const router = express.Router();

router.use(verifyAccessToken);
// Create a new payment
router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addPaymentSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), createPayment);

// Get all payments
router.get('/user-payments/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), getPayments);

// Get a payment by ID
router.get('/:paymentId', ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), getPaymentById);

// Update a payment by ID
router.put('/:paymentId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transferPayment);

// Delete a payment by ID
router.delete('/:paymentId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), deletePayment);

// Transfer money between users
router.post('/transfer', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(transferPaymentSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER,Roles.USER), transferController.transferMoney);

module.exports = router;