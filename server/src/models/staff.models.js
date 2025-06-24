const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StaffSchema = new mongoose.Schema({
  staffId: { type: Number, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true, enum: ["Finance", "Admin", "Loan"] },
}, { timestamps: true });

StaffSchema.plugin(AutoIncrement, { inc_field: 'staffId', start_seq: 1000, increment_by: 1 });
module.exports = mongoose.model('Staff', StaffSchema);
