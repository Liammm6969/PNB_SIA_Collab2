const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware } = require('../middleware');
const { RegisterUserSchema,
  LoginUserSchema,
  ValidateIdSchema } = require('../schema/index.js');


// Register a new user
router.post('/register', ValidateRequestBodyMiddleware(RegisterUserSchema), userController.registerUser);

// Login user
router.post('/login', ValidateRequestBodyMiddleware(LoginUserSchema), userController.loginUser);

// Get user profile by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(ValidateIdSchema), userController.getUserProfile);

// List all users
router.get('/', userController.listUsers);

module.exports = router;