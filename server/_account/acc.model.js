const mongoose = require("mongoose");

const baseAccountSchema = {
  accountFirstName: { type: String, required: true },
  accountLastName: { type: String, required: true },
  accountMiddleName: { type: String, required: false },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive", "closed"], default: "active" },
  createdAt: { type: Date, default: Date.now },
};

const businessAccountSchema = new mongoose.Schema({
  ...baseAccountSchema,
  accountType: { type: String, enum: ["business"], default: "business", required: true },
  businessName: { type: String, required: true },
});

const personalAccountSchema = new mongoose.Schema({
  ...baseAccountSchema,
  accountType: { type: String, enum: ["personal"], default: "personal", required: true },
});

module.exports = {
  BusinessAccount: mongoose.model("BusinessAccount", businessAccountSchema),
  PersonalAccount: mongoose.model("PersonalAccount", personalAccountSchema),
};
