const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
////////////////USER INPUTS
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
////////////////AUTOMATIC INPUTS(Randomly generated)
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  businessAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessAccount',
    required: false
  },
  personalAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PersonalAccount',
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
