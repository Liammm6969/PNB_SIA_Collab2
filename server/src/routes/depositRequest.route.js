const express = require('express');
const router = express.Router();
const depositRequestController = require('../controllers/depositRequest.controller');

const {
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware,
  verifyAccessToken,
  ApiLimiterMiddleware
} = require('../middleware');

const { 
  createDepositRequestSchema,
  approveRejectDepositRequestSchema,
  validateDepositRequestIdSchema,
  validateUserIdSchema
} = require('../schema');


// Routes are currently open for development - add authentication later
router.use(verifyAccessToken);

// Create a new deposit request
router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(createDepositRequestSchema),  depositRequestController.createDepositRequest);
// router.post('/', ApiLimiterMiddleware, depositRequestController.createDepositRequest);

// Get deposit request statistics (for Finance staff)
router.get('/stats', depositRequestController.getDepositRequestStats);
// router.get('/stats', depositRequestController.getDepositRequestStats());

// Get all deposit requests (for Finance staff)
router.get('/',  depositRequestController.getAllDepositRequests);
// router.get('/', depositRequestController.getAllDepositRequests);

// Get deposit requests for a specific user
router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema),  depositRequestController.getDepositRequestsByUser);
// router.get('/user/:userId', depositRequestController.getDepositRequestsByUser);

// Get specific deposit request by ID
router.get('/:depositRequestId', ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema),  depositRequestController.getDepositRequestById);
// router.get('/:depositRequestId', depositRequestController.getDepositRequestById);

// Approve deposit request (Finance staff only)
router.post('/:depositRequestId/approve', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema), ValidateRequestBodyMiddleware(approveRejectDepositRequestSchema), depositRequestController.approveDepositRequest);
// router.post('/:depositRequestId/approve', ApiLimiterMiddleware, depositRequestController.approveDepositRequest);

// Reject deposit request (Finance staff only)
router.post('/:depositRequestId/reject', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateDepositRequestIdSchema), ValidateRequestBodyMiddleware(approveRejectDepositRequestSchema),  depositRequestController.rejectDepositRequest);
// router.post('/:depositRequestId/reject', ApiLimiterMiddleware, depositRequestController.rejectDepositRequest);

module.exports = router;
