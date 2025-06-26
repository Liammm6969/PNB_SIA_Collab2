const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const ledgerController = require("../controllers/ledger.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, LoginLimiter, ApiLimiterMiddleware } = require('../middleware/index.js');
const Roles = require('../lib/roles.js');
const { registerUserSchema,
  loginUserSchema,
  validateUserIdSchema } = require('../schema/index.js');


// Register a new user

router.post('/register', ValidateRequestBodyMiddleware(registerUserSchema), ApiLimiterMiddleware, userController.registerUser);

// Login user

router.post('/login', ValidateRequestBodyMiddleware(loginUserSchema), LoginLimiter, userController.loginUser);

router.post('/verify-otp', userController.verifyOTP);


router.use(verifyAccessToken);


// Get user profile by ID
router.get('/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), userController.getUserProfile);

// Get user ledger (comprehensive transaction log)
router.get('/:userId/ledger', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), ledgerController.getUserLedger);


router.get('/', userController.listUsers);

// Get user by userIdSeq
router.get('/seq/:userIdSeq', userController.getUserByUserIdSeq);

router.post('/logout/:userId', userController.logoutUser);




module.exports = router;