const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const paymentSchema = new mongoose.Schema({
  paymentId: { type: Number, unique: true },
  paymentStringId: { type: String},
  fromUser: { type: Number, ref: 'User', required: true },
  toUser: { type: Number, ref: 'User', required: true },
  amount: Number,
  details: String,
  balanceAfterPayment: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

paymentSchema.plugin(AutoIncrement, { inc_field: 'paymentId', start_seq: 4000, increment_by: 1 });

paymentSchema.post('save', async function (doc, next) {
  if (!doc.paymentStringId && doc.paymentId) {
    const paymentStringId = `PAYMENT_${doc.paymentId}`;
    await doc.model('Payment').findByIdAndUpdate(doc._id, { paymentStringId });
    doc.paymentStringId = paymentStringId;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
