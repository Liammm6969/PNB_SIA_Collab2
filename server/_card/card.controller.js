const { BusinessAccount } = require('../_account/acc.model');
const Card = require('./card.model');
const { createDocument } = require('../utils/controllerHelper');

// Create a business card
exports.createBusinessCard = async (req, res) => {
  try {
    const { businessAccountId, cardPassword, expiryDate, cvv, cardType } = req.body;
    // Ensure the business account exists and is active
    const businessAccount = await BusinessAccount.findOne({ _id: businessAccountId, status: 'active' });
    if (!businessAccount) {
      return res.status(404).json({ message: 'Active business account not found.' });
    }
    // Generate a card number in the format: (Current year)-(CurrentMonth and Day)-(sequential count)
    const now = new Date();
    const year = now.getFullYear();
    const monthDay = (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
    const cardCount = await Card.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()), $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) } });
    const sequential = (cardCount + 1).toString().padStart(4, '0');
    const cardNumber = `${year}-${monthDay}-${sequential}`;
    // Use createDocument helper for card creation
    createDocument(Card, {
      cardNumber,
      cardPassword, // Should be hashed in production
      expiryDate,
      cvv,
      cardType: cardType || 'debit',
      linkedAccount: businessAccount._id,
      linkedAccountModel: 'BusinessAccount',
      status: 'pending' // Default status on creation
    }, res);
  } catch (error) {
    res.status(500).json({ message: 'Error creating business card', error: error.message });
  }
};
