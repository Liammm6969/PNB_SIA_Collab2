const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken } = require('../middleware/index.js');
const { registerUserSchema,
  loginUserSchema,
  validateIdSchema } = require('../schema/index.js');


// Register a new user
router.post('/register', ValidateRequestBodyMiddleware(registerUserSchema), userController.registerUser);

// Login user
router.post('/login', ValidateRequestBodyMiddleware(loginUserSchema), userController.loginUser);

router.use(verifyAccessToken);


// Get user profile by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(validateIdSchema), userController.getUserProfile);

// List all users
router.get('/', userController.listUsers);

module.exports = router;