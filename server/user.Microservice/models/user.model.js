const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: Date,
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
