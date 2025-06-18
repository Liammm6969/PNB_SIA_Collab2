const mongoose = require('mongoose');

// Send Money Schema
const SendMoneySchema = new mongoose.Schema({
  senderAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderAccountModel'
  },
  senderAccountModel: {
    type: String,
    required: true,
    enum: ['BusinessAccount', 'PersonalAccount']
  },
  receiverAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverAccountModel'
  },
  receiverAccountModel: {
    type: String,
    required: true,
    enum: ['BusinessAccount', 'PersonalAccount']
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
});

// Transfer Money Schema
const TransferMoneySchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'fromAccountModel'
  },
  fromAccountModel: {
    type: String,
    required: true,
    enum: ['BusinessAccount', 'PersonalAccount']
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'toAccountModel'
  },
  toAccountModel: {
    type: String,
    required: true,
    enum: ['BusinessAccount', 'PersonalAccount']
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
});

module.exports = {
  SendMoney: mongoose.model('SendMoney', SendMoneySchema),
  TransferMoney: mongoose.model('TransferMoney', TransferMoneySchema),

};
