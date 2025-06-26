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



// Routes are currently open for development - add authentication later
router.use(verifyAccessToken);

// Add a new beneficiary
router.post('/', ApiLimiterMiddleware, ValidateRequestBodyMiddleware(addBeneficiarySchema), beneficiaryController.addBeneficiary);
// router.post('/', beneficiaryController.addBeneficiary);

// Get all beneficiaries for a user
router.get('/user/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), beneficiaryController.getBeneficiariesByUser);
// router.get('/user/:userId', beneficiaryController.getBeneficiariesByUser);

// Validate recipient account number
router.get('/validate/:accountNumber', ValidateRequestRouteParameterMiddleware(validateAccountNumberSchema), beneficiaryController.validateRecipient);
// router.get('/validate/:accountNumber', beneficiaryController.validateRecipient);

// Get a single beneficiary by ID
router.get('/:beneficiaryId', ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), beneficiaryController.getBeneficiaryById);
// router.get('/:beneficiaryId', beneficiaryController.getBeneficiaryById);

// Update a beneficiary
router.put('/:beneficiaryId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), beneficiaryController.updateBeneficiary);
// router.put('/:beneficiaryId', beneficiaryController.updateBeneficiary);

// Delete a beneficiary
router.delete('/:beneficiaryId', ApiLimiterMiddleware, ValidateRequestRouteParameterMiddleware(validateBeneficiaryIdSchema), beneficiaryController.deleteBeneficiary);
// router.delete('/:beneficiaryId', beneficiaryController.deleteBeneficiary);

module.exports = router;
