const { Beneficiary, User } = require("../models/index.js");
const mongoose = require('mongoose');

class BeneficiaryService {
  constructor() {
    this.addBeneficiary = this.addBeneficiary.bind(this);
    this.getBeneficiariesByUser = this.getBeneficiariesByUser.bind(this);
    this.getBeneficiaryById = this.getBeneficiaryById.bind(this);
    this.updateBeneficiary = this.updateBeneficiary.bind(this);
    this.deleteBeneficiary = this.deleteBeneficiary.bind(this);
    this.validateRecipient = this.validateRecipient.bind(this);
  }

  async addBeneficiary(beneficiaryData) {
    try {
      const { userId, accountNumber, nickname, name, accountType, isFavorite } = beneficiaryData;
      
      // Check if beneficiary already exists for this user
      const existingBeneficiary = await Beneficiary.findOne({ userId, accountNumber });
      if (existingBeneficiary) {
        throw new Error('Beneficiary already exists');
      }

      // Validate that the account number belongs to a real user
      const recipientUser = await User.findOne({ accountNumber });
      if (!recipientUser) {
        throw new Error('Invalid account number - user not found');
      }

      const beneficiary = new Beneficiary({
        userId,
        accountNumber,
        nickname,
        name: name || recipientUser.displayName?.fullName || 'Unknown User',
        accountType: accountType || recipientUser.accountType,
        isFavorite: isFavorite || false
      });

      await beneficiary.save();
      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  async getBeneficiariesByUser(userId) {
    try {
      const beneficiaries = await Beneficiary.find({ userId, isActive: true })
        .sort({ isFavorite: -1, lastUsed: -1 }); // Favorites first, then by last used
      return beneficiaries;
    } catch (err) {
      throw err;
    }
  }

  async getBeneficiaryById(beneficiaryId) {
    try {
      const beneficiary = await Beneficiary.findOne({ beneficiaryId });
      if (!beneficiary) {
        throw new Error('Beneficiary not found');
      }
      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  async updateBeneficiary(beneficiaryId, updateData) {
    try {
      const beneficiary = await Beneficiary.findOneAndUpdate(
        { beneficiaryId },
        updateData,
        { new: true }
      );
      if (!beneficiary) {
        throw new Error('Beneficiary not found');
      }
      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  async deleteBeneficiary(beneficiaryId) {
    try {
      const beneficiary = await Beneficiary.findOneAndUpdate(
        { beneficiaryId },
        { isActive: false },
        { new: true }
      );
      if (!beneficiary) {
        throw new Error('Beneficiary not found');
      }
      return beneficiary;
    } catch (err) {
      throw err;
    }
  }

  async validateRecipient(accountNumber) {
    try {
      const user = await User.findOne({ accountNumber }).select('-password');
      if (!user) {
        throw new Error('Account number not found');
      }

      return {
        accountNumber: user.accountNumber,
        name: user.displayName?.fullName || 'Unknown User',
        accountType: user.accountType,
        isActive: true,
        userId: user.userId
      };
    } catch (err) {
      throw err;
    }
  }

  async updateLastUsed(userId, accountNumber) {
    try {
      await Beneficiary.findOneAndUpdate(
        { userId, accountNumber },
        { lastUsed: new Date() }
      );
    } catch (err) {
      console.error('Failed to update last used for beneficiary:', err);
      // Don't throw error as this is not critical
    }
  }
}

module.exports = new BeneficiaryService();
