const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.Controller');

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get user profile by ID
router.get('/:id', userController.getUserProfile);

// List all users
router.get('/', userController.listUsers);

module.exports = router;