const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  amount: Number,
  details: String,
  balanceAfterPayment: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
