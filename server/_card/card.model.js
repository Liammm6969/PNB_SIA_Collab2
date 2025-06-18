const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  cardPassword: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    enum: ["debit", "credit"],
    default: "debit",
    required: true,
  },
  linkedAccount: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "linkedAccountModel",
  },
  linkedAccountModel: {
    type: String,
    enum: ["BusinessAccount", "PersonalAccount"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "active", "blocked", "expired"],
    default: "pending",
    required: true,
  },
});

module.exports = mongoose.model("Card", cardSchema);
