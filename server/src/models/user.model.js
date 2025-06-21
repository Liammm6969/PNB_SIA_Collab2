
const mongoose = require('mongoose');
const { type } = require('../schema/add-payment.schema');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: function () { return this.accountType === 'personal'; },
  },
  companyName: { type: String, required: function () { return this.accountType === 'business'; } },
  accountNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Finance', 'BusinessOwner', 'User'], default: 'User' },
  address: String,
  dateOfBirth: { type: Date, max: '2025-12-31', required: function () { return this.accountType === 'personal' } },
  balance: { type: Number, default: 0 },
  withdrawalMethods: {
    type: String,
    enum: ['Bank Transfer', 'PayPal', 'Credit Card', 'Crypto Currency'],
    default: 'Bank Transfer',
  },
  accountType: {
    type: String,
    enum: ['personal', 'business'],
    required: true,
  }
},
  { timestamps: true });

module.exports = mongoose.model('User', userSchema);
