const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const ledgerController = require("../controllers/ledger.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, LoginLimiter, PermissionMiddleware } = require('../middleware/index.js');
const Roles = require('../lib/roles.js');
const { registerUserSchema,
  loginUserSchema,
  validateUserIdSchema} = require('../schema/index.js');


// Register a new user
// router.post('/register', ValidateRequestBodyMiddleware(registerUserSchema), userController.registerUser);

router.post('/register', userController.registerUser);

// Login user
// router.post('/login', ValidateRequestBodyMiddleware(loginUserSchema), LoginLimiter, userController.loginUser);

router.post('/login', userController.loginUser);
router.post('/verify-otp', userController.verifyOTP);


// router.use(verifyAccessToken);


// Get user profile by ID
// router.get('/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), userController.getUserProfile);

router.get('/:userId',  userController.getUserProfile);

// Get user ledger (comprehensive transaction log)
router.get('/:userId/ledger', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), ledgerController.getUserLedger);

// List all users
// router.get('/', PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), userController.listUsers);

router.get('/', userController.listUsers);

// Get user by userIdSeq
router.get('/seq/:userIdSeq', userController.getUserByUserIdSeq);




module.exports = router;