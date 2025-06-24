const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
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
router.get('/:userId', ValidateRequestRouteParameterMiddleware(validateUserIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), userController.getUserProfile);

// List all users
router.get('/', PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), userController.listUsers);




module.exports = router;