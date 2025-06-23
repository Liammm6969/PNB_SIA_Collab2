const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  fullName: {
    type: String,
    required: function () { return this.accountType === 'personal'; },
  },
  companyName: { type: String, required: function () { return this.accountType === 'business'; } },
  accountNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true,},
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
  },
  otp: { type: String },
  otpExpires: { type: Date },
},
  { timestamps: true });

userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 100, increment_by: 1 });

module.exports = mongoose.model('User', userSchema);
