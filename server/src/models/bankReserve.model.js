const mongoose = require('mongoose');

const bankReserveSchema = new mongoose.Schema({
  total_balance: { 
    type: Number, 
    required: true,
    default: 1000000 // Initialize with 1 million for demo purposes
  },
  last_transaction_id: {
    type: String,
    default: null
  },
  last_transaction_amount: {
    type: Number,
    default: 0
  },
  last_transaction_type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'initialization'],
    default: 'initialization'
  }
}, { 
  timestamps: true,
  collection: 'bank_reserve' // Explicit collection name
});

// Static method to get or create the bank reserve
bankReserveSchema.statics.getInstance = async function() {
  let bankReserve = await this.findOne();
  
  if (!bankReserve) {
    // Initialize bank reserve if it doesn't exist
    bankReserve = new this({
      total_balance: 1000000, // Start with 1 million
      last_transaction_type: 'initialization'
    });
    await bankReserve.save();
  }
  
  return bankReserve;
};

// Method to update balance with transaction tracking
bankReserveSchema.methods.updateBalance = async function(amount, transactionType, transactionId = null) {
  this.total_balance += amount;
  this.last_transaction_amount = amount;
  this.last_transaction_type = transactionType;
  this.last_transaction_id = transactionId;
  
  return await this.save();
};

// Method to check if sufficient funds are available
bankReserveSchema.methods.hasSufficientFunds = function(amount) {
  return this.total_balance >= amount;
};

module.exports = mongoose.model('BankReserve', bankReserveSchema);
