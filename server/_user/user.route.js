const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

// Create user
router.post('/', userController.createUser);
// Get user by ID
router.get('/:id', userController.getUserById);
// List all users
router.get('/', userController.listUsers);

module.exports = router;
