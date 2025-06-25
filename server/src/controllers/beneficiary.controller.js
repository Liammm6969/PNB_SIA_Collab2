const { StatusCodes } = require('http-status-codes');
const { BeneficiaryService } = require("../services/index.js");

// Add a new beneficiary
exports.addBeneficiary = async (req, res) => {
  try {
    const beneficiaryData = req.body;
    const beneficiary = await BeneficiaryService.addBeneficiary(beneficiaryData);
    res.status(StatusCodes.CREATED).json(beneficiary);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Get all beneficiaries for a user
exports.getBeneficiariesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const beneficiaries = await BeneficiaryService.getBeneficiariesByUser(parseInt(userId));
    res.status(StatusCodes.OK).json(beneficiaries);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

// Get a single beneficiary by ID
exports.getBeneficiaryById = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await BeneficiaryService.getBeneficiaryById(parseInt(beneficiaryId));
    res.status(StatusCodes.OK).json(beneficiary);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

// Update a beneficiary
exports.updateBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const updateData = req.body;
    const beneficiary = await BeneficiaryService.updateBeneficiary(parseInt(beneficiaryId), updateData);
    res.status(StatusCodes.OK).json(beneficiary);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// Delete a beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    const { beneficiaryId } = req.params;
    const beneficiary = await BeneficiaryService.deleteBeneficiary(parseInt(beneficiaryId));
    res.status(StatusCodes.OK).json(beneficiary);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};

// Validate recipient account number
exports.validateRecipient = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const recipient = await BeneficiaryService.validateRecipient(accountNumber);
    res.status(StatusCodes.OK).json(recipient);
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({ error: err.message });
  }
};
