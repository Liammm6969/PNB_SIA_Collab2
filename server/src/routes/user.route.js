const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken, LoginLimiter, PermissionMiddleware } = require('../middleware/index.js');

const { registerUserSchema,
  loginUserSchema,
  validateIdSchema } = require('../schema/index.js');


// Register a new user
router.post('/register', ValidateRequestBodyMiddleware(registerUserSchema), userController.registerUser);

// Login user
router.post('/login', ValidateRequestBodyMiddleware(loginUserSchema), LoginLimiter, userController.loginUser);

router.use(verifyAccessToken);


// Get user profile by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), PermissionMiddleware('read', 'user', req => req.params.id), userController.getUserProfile);

// List all users
router.get('/', PermissionMiddleware('read', 'user'), userController.listUsers);

module.exports = router;