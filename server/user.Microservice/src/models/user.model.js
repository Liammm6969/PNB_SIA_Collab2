const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type: String, enum: ['Admin', 'Finance', 'User'], default: 'User' },
  address: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date, max: '2025-12-31' },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'PHP' },
  withdrawalMethods: [
    {
      type: { type: String, default: 'Bank Transfer' },
      cardNumber: String,
      local: { type: Boolean, default: true },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
