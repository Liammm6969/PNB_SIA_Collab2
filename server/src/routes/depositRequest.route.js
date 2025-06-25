const express = require('express');
const router = express.Router();
const depositRequestController = require('../controllers/depositRequest.controller');

const { 
  ValidateRequestBodyMiddleware, 
  ValidateRequestRouteParameterMiddleware, 
  verifyAccessToken, 
  PermissionMiddleware, 
  ApiLimiterMiddleware 
} = require('../middleware');

// const { 
//   createDepositRequestSchema,
//   approveRejectDepositRequestSchema,
//   validateDepositRequestIdSchema,
//   validateUserIdSchema
// } = require('../schema');

const Roles = require('../lib/roles');

// Routes are currently open for development - add authentication later
// router.use(verifyAccessToken);

// Create a new deposit request
// router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(createDepositRequestSchema), PermissionMiddleware(Roles.USER), depositRequestController.createDepositRequest);
router.post('/', depositRequestController.createDepositRequest);

// Get deposit request statistics (for Finance staff)
// router.get('/stats', PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), depositRequestController.getDepositRequestStats);
router.get('/stats', depositRequestController.getDepositRequestStats);

// Get all deposit requests (for Finance staff)
// router.get('/', PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), depositRequestController.getAllDepositRequests);
router.get('/', depositRequestController.getAllDepositRequests);

// Get deposit requests for a specific user
// router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.USER), depositRequestController.getDepositRequestsByUser);
router.get('/user/:userId', depositRequestController.getDepositRequestsByUser);

// Get specific deposit request by ID
// router.get('/:depositRequestId', ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.USER), depositRequestController.getDepositRequestById);
router.get('/:depositRequestId', depositRequestController.getDepositRequestById);

// Approve deposit request (Finance staff only)
// router.post('/:depositRequestId/approve', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema), ValidateRequestBodyMiddleware(approveRejectDepositRequestSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), depositRequestController.approveDepositRequest);
router.post('/:depositRequestId/approve', depositRequestController.approveDepositRequest);

// Reject deposit request (Finance staff only)
// router.post('/:depositRequestId/reject', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema), ValidateRequestBodyMiddleware(approveRejectDepositRequestSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), depositRequestController.rejectDepositRequest);
router.post('/:depositRequestId/reject', depositRequestController.rejectDepositRequest);

module.exports = router;
