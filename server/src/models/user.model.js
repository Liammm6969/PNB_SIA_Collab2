const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  fullName: { type: String, required: true },
  accountType: { type: String, enum: ['admin', 'user'], default: 'user' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  accountNumber: { type: String, unique: true, required: true },
  // otp: { type: String },
  // otpExpires: { type: Date },
},
  { timestamps: true });

userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 100, increment_by: 1 });

module.exports = mongoose.model('User', userSchema);
