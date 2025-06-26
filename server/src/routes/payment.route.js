const {
  createPayment,
  getPayments,
  getAllPayments,
  getPaymentById,
  getUserStatements,
  createWithdrawal,
  createDeposit,
  transferPayment,
  deletePayment
} = require("../controllers/payment.controller.js");



const {
  addPaymentSchema,
  transferPaymentSchema,
  validatePaymentIdSchema,
  validateUserIdSchema,
  withdrawSchema,
} = require("../schema/index.js");

const {
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware, verifyAccessToken, PermissionMiddleware, ApiLimiterMiddleware
} = require('../middleware/index.js');
const Roles = require('../lib/roles.js');
const express = require('express');



const router = express.Router();

// router.use(verifyAccessToken);
// Create a new payment
// router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addPaymentSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), createPayment);

router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addPaymentSchema), createPayment);

// Get all payments (Finance/Admin only)
router.get('/', getAllPayments);

// Get payments for specific user
// router.get('/user-payments/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), getPayments);
router.get('/user-payments/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), getPayments);

// Get user statements
router.get('/user-statements/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), getUserStatements);

// Create withdrawal
router.post('/withdraw', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(withdrawSchema), createWithdrawal);

// Create deposit
router.post('/deposit', ApiLimiterMiddleware, createDeposit);

// Get a payment by ID
// router.get('/:paymentId', ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), getPaymentById);
router.get('/:paymentId', ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), getPaymentById);
// Update a payment by ID
// router.put('/:paymentId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), transferPayment);

router.put('/:paymentId', ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), transferPayment);

// Delete a payment by ID
// router.delete('/:paymentId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validatePaymentIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER), deletePayment);

router.delete('/:paymentId', deletePayment);

// Transfer money between users
// router.post('/transfer', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(transferPaymentSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), transferController.transferMoney);



module.exports = router;