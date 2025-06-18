const express = require('express');
const router = express.Router();
const cardController = require('./card.controller');

// Route to create a business card
router.post('/create-business-card', cardController.createBusinessCard);

module.exports = router;
