const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, sparse: true },
  userIdSeq: { type: Number, unique: true },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: function () { return this.accountType === 'business'; }
  },
  accountType: { type: String, enum: ['personal', 'business'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  accountNumber: { type: String, unique: true, required: true },

},
  { timestamps: true });

userSchema.plugin(AutoIncrement, { inc_field: 'userIdSeq', start_seq: 1000, increment_by: 1 });

userSchema.post('save', async function (doc, next) {
  if (!doc.userId && doc.userIdSeq) {
    let prefix = doc.accountType === 'business' ? 'BUSNS_' : 'PRSNL_';
    const userId = `${prefix}${doc.userIdSeq}`;
    await doc.model('User').findByIdAndUpdate(doc._id, { userId });
    doc.userId = userId;
  }
  next();
});

// Virtual property to get display name based on account type
userSchema.virtual('displayName').get(function () {
  if (this.accountType === 'personal') {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: `${this.firstName} ${this.lastName}`
    };
  } else if (this.accountType === 'business') {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: `${this.firstName} ${this.lastName}`,
      businessName: this.businessName
    };
  }
  return 'Unknown';
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });



module.exports = mongoose.model('User', userSchema);
