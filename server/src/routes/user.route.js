const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, LoginLimiter, PermissionMiddleware } = require('../middleware/index.js');
const Roles = require('../lib/roles.js');
const { registerUserSchema,
  loginUserSchema,
  validateIdSchema } = require('../schema/index.js');


// Register a new user
router.post('/register', ValidateRequestBodyMiddleware(registerUserSchema), userController.registerUser);

// Login user
router.post('/login', ValidateRequestBodyMiddleware(loginUserSchema), LoginLimiter, userController.loginUser);

router.use(verifyAccessToken);


// Get user profile by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware(Roles.ADMIN, Roles.FINANCE, Roles.BUSINESS_OWNER, Roles.USER), userController.getUserProfile);

// List all users
router.get('/', PermissionMiddleware(Roles.ADMIN, Roles.FINANCE), userController.listUsers);

module.exports = router;