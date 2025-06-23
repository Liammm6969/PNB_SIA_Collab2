const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const transactionSchema = new mongoose.Schema({
  transactionId: { type: Number, unique: true },
  userId: { type: Number, ref: 'User', required: true },
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

transactionSchema.plugin(AutoIncrement, { inc_field: 'transactionId', start_seq: 100, increment_by: 1 });
module.exports = mongoose.model('Transaction', transactionSchema);
