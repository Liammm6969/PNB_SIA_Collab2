const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const beneficiarySchema = new mongoose.Schema({
  beneficiaryId: { type: Number, unique: true },
  beneficiaryStringId: { type: String, unique: true },
  userId: { type: Number, ref: 'User', required: true }, // Owner of the beneficiary
  accountNumber: { type: String, required: true }, // Beneficiary's account number
  nickname: { type: String, required: true }, // User-defined nickname
  name: { type: String, required: true }, // Full name of the beneficiary
  accountType: { type: String, enum: ['personal', 'business'], default: 'personal' },
  isFavorite: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

beneficiarySchema.plugin(AutoIncrement, { inc_field: 'beneficiaryId', start_seq: 5000, increment_by: 1 });

beneficiarySchema.post('save', async function (doc, next) {
  if (!doc.beneficiaryStringId && doc.beneficiaryId) {
    const beneficiaryStringId = `BENEF_${doc.beneficiaryId}`;
    await doc.model('Beneficiary').findByIdAndUpdate(doc._id, { beneficiaryStringId });
    doc.beneficiaryStringId = beneficiaryStringId;
  }
  next();
});

// Compound index to ensure a user can't have duplicate beneficiaries
beneficiarySchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
