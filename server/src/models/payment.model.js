const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const paymentSchema = new mongoose.Schema({
  paymentId: { type: Number, unique: true },
  fromUser: { type: Number, ref: 'User', required: true },
  toUser: { type: Number, ref: 'User', required: true },
  amount: Number,
  details: String,
  balanceAfterPayment: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

paymentSchema.plugin(AutoIncrement, { inc_field: 'paymentId', start_seq: 4000, increment_by: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
