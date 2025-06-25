const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiary.controller');

const { 
  ValidateRequestBodyMiddleware, 
  ValidateRequestRouteParameterMiddleware, 
  verifyAccessToken, 
  PermissionMiddleware, 
  ApiLimiterMiddleware 
} = require('../middleware');

const { 
  addBeneficiarySchema,
  validateBeneficiaryIdSchema,
  validateUserIdSchema,
  validateAccountNumberSchema
} = require('../schema');

const Roles = require('../lib/roles');

// Routes are currently open for development - add authentication later
// router.use(verifyAccessToken);

// Add a new beneficiary
// router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addBeneficiarySchema), PermissionMiddleware(Roles.USER), beneficiaryController.addBeneficiary);
router.post('/', beneficiaryController.addBeneficiary);

// Get all beneficiaries for a user
// router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.USER), beneficiaryController.getBeneficiariesByUser);
router.get('/user/:userId', beneficiaryController.getBeneficiariesByUser);

// Validate recipient account number
// router.get('/validate/:accountNumber', ValidateRequestRouteParameterMiddleware(validateAccountNumberSchema), PermissionMiddleware(Roles.USER), beneficiaryController.validateRecipient);
router.get('/validate/:accountNumber', beneficiaryController.validateRecipient);

// Get a single beneficiary by ID
// router.get('/:beneficiaryId', ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), PermissionMiddleware(Roles.USER), beneficiaryController.getBeneficiaryById);
router.get('/:beneficiaryId', beneficiaryController.getBeneficiaryById);

// Update a beneficiary
// router.put('/:beneficiaryId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), PermissionMiddleware(Roles.USER), beneficiaryController.updateBeneficiary);
router.put('/:beneficiaryId', beneficiaryController.updateBeneficiary);

// Delete a beneficiary
// router.delete('/:beneficiaryId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), PermissionMiddleware(Roles.USER), beneficiaryController.deleteBeneficiary);
router.delete('/:beneficiaryId', beneficiaryController.deleteBeneficiary);

module.exports = router;
