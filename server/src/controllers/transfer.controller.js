const TransferService = require("../services/transfer.service.js");
const { StatusCodes } = require('http-status-codes');

// Transfer money between users
// POST /api/payments/transfer
// Body: { fromUser, toUser, amount, details, recipientType, identifier }
exports.transferMoney = async (req, res) => {
  try {
    const { fromUser, toUser, amount, details, recipientType, identifier } = req.body; // Removed identifierType

    if (!['User', 'Business'].includes(recipientType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid recipient type. Must be User or Business.' });
    }

    let identifierType;
    if (identifier !== undefined && identifier !== null) {
      if (identifier.includes('@')) {
        identifierType = 'Email';
      } else if (/^\d+$/.test(identifier)) {
        identifierType = 'AccountNumber';
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid identifier format. Must be a valid email or account number.' });
      }
    }

    const transferData = { fromUser, toUser, amount, details, recipientType };
    if (identifierType) transferData.identifierType = identifierType;
    if (identifier) transferData.identifier = identifier;
    const result = await TransferService.transferMoney(transferData);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing transfer', error: error.message });
  }
};