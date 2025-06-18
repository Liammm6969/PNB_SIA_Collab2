const express = require('express');
const router = express.Router();
const accController = require('./acc.controller');

// Create business account
router.post('/business', accController.createBusinessAccount);
// Create personal account
router.post('/personal', accController.createPersonalAccount);
// Get account by ID and type
router.get('/:type/:id', accController.getAccountById);
// List accounts by type
router.get('/', accController.listAccounts);

module.exports = router;
