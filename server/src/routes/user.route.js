const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { ValidateRequestBodyMiddleware, ValidateRequestRouteParameterMiddleware, verifyAccessToken } = require('../middleware/index.js');
const { RegisterUserSchema,
  LoginUserSchema,
  ValidateIdSchema } = require('../schema/index.js');


// Register a new user
router.post('/register', ValidateRequestBodyMiddleware(RegisterUserSchema), userController.registerUser);

// Login user
router.post('/login', ValidateRequestBodyMiddleware(LoginUserSchema), userController.loginUser);

router.use(verifyAccessToken);


// Get user profile by ID
router.get('/:id', ValidateRequestRouteParameterMiddleware(ValidateIdSchema), userController.getUserProfile);

// List all users
router.get('/', userController.listUsers);

module.exports = router;