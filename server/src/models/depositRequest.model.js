const mongoose = require('mongoose');

const depositRequestSchema = new mongoose.Schema({
  depositRequestId: {
    type: Number,
    unique: true
  },
  depositRequestStringId: {
    type: String,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  userIdSeq: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than 0']
  },
  note: {
    type: String,
    default: '',
    maxlength: [500, 'Note cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  processedBy: {
    type: String,
    default: null // Staff ID who processed the request
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Auto-increment depositRequestId
depositRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const lastRequest = await this.constructor.findOne({}, {}, { sort: { 'depositRequestId': -1 } });
      this.depositRequestId = lastRequest ? lastRequest.depositRequestId + 1 : 1;
      this.depositRequestStringId = `DEP_REQ_${String(this.depositRequestId).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Index for efficient queries
depositRequestSchema.index({ userId: 1, status: 1 });
depositRequestSchema.index({ status: 1, createdAt: -1 });
depositRequestSchema.index({ userIdSeq: 1 });

const DepositRequest = mongoose.model('DepositRequest', depositRequestSchema);

module.exports = DepositRequest;
