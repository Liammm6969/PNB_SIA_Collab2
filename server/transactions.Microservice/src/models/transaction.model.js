const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: String,
  paymentDetails: String,
  amount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Paid'],
    default: 'Pending'
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
