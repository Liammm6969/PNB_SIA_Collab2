const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },  
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

userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 1000, increment_by: 1 });

module.exports = mongoose.model('User', userSchema);
