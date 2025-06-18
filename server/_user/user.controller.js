const User = require('./user.model');
const { BusinessAccount, PersonalAccount } = require('../_account/acc.model');
const { createDocument, getDocumentById, listDocuments } = require('../utils/controllerHelper');

// Create user
exports.createUser = (req, res) => {
  const { name, email, password, businessAccountId, personalAccountId } = req.body;
  // Generate a random account number (for demo)
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  createDocument(User, {
    name,
    email,
    password, // Should be hashed in production
    accountNumber,
    businessAccount: businessAccountId || undefined,
    personalAccount: personalAccountId || undefined
  }, res);
};

// Get user by ID
exports.getUserById = (req, res) => {
  getDocumentById(User, req.params.id, res, ['businessAccount', 'personalAccount']);
};

// List all users
exports.listUsers = (req, res) => {
  listDocuments(User, res, ['businessAccount', 'personalAccount']);
};
