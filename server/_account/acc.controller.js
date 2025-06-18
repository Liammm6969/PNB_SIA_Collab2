const { BusinessAccount, PersonalAccount } = require('./acc.model');
const { createDocument } = require('../utils/controllerHelper');

// Create Business Account
exports.createBusinessAccount = (req, res) => {
  const { accountFirstName, accountLastName, accountMiddleName, businessName } = req.body;
  createDocument(BusinessAccount, {
    accountFirstName,
    accountLastName,
    accountMiddleName,
    businessName
  }, res);
};

// Create Personal Account
exports.createPersonalAccount = (req, res) => {
  const { accountFirstName, accountLastName, accountMiddleName } = req.body;
  createDocument(PersonalAccount, {
    accountFirstName,
    accountLastName,
    accountMiddleName
  }, res);
};

// Get Account by ID (Business or Personal)
exports.getAccountById = async (req, res) => {
  try {
    const { id, type } = req.params;
    let account;
    if (type === 'business') {
      account = await BusinessAccount.findById(id);
    } else {
      account = await PersonalAccount.findById(id);
    }
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all accounts (Business or Personal)
exports.listAccounts = async (req, res) => {
  try {
    const { type } = req.query;
    let accounts;
    if (type === 'business') {
      accounts = await BusinessAccount.find();
    } else {
      accounts = await PersonalAccount.find();
    }
    res.json(accounts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
