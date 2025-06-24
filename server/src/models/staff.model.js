const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StaffSchema = new mongoose.Schema({
  staffId: { type: Number, unique: true },
  staffStringId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { type: String, required: true, enum: ["Finance", "Admin", "Loan"] },
}, { timestamps: true });

StaffSchema.plugin(AutoIncrement, { inc_field: 'staffId', start_seq: 3000, increment_by: 1 });

StaffSchema.post('save', async function (doc, next) {
  if (!doc.staffStringId && doc.staffId) {
    const staffStringId = `STAFF_${doc.staffId}`;
    await doc.model('Staff').findByIdAndUpdate(doc._id, { staffStringId });
    doc.staffStringId = staffStringId;
  }
  next();
});

module.exports = mongoose.model('Staff', StaffSchema);
