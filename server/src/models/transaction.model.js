const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const transactionSchema = new mongoose.Schema({
  transactionId: { type: Number, unique: true },
  transactionStringId: { type: String, unique: true },
  fromUser: { type: Number, ref: 'User', required: true },
  toUser: { type: Number, ref: 'User', required: true },
  amount: Number,
  details: String,
  balanceAfterPayment: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

transactionSchema.plugin(AutoIncrement, { inc_field: 'transactionId', start_seq: 2000, increment_by: 1 });

transactionSchema.post('save', async function (doc, next) {
  if (!doc.transactionStringId && doc.transactionId) {
    const transactionStringId = `TXN_${doc.transactionId}`;
    await doc.model('Transaction').findByIdAndUpdate(doc._id, { transactionStringId });
    doc.transactionStringId = transactionStringId;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
