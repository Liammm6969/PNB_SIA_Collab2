const TransferService = require("../services/transfer.service.js");
const { StatusCodes } = require('http-status-codes');

// Transfer money between users
// POST /api/payments/transfer
// Body: { fromUser, toUser, amount, details, recipientType }
exports.transferMoney = async (req, res) => {
  try {
    const { fromUser, toUser, amount, details, recipientType } = req.body; // Added recipientType to specify User or Business

    if (!['User', 'Business'].includes(recipientType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid recipient type. Must be User or Business.' });
    }

    const transferData = { fromUser, toUser, amount, details, recipientType };
    const result = await TransferService.transferMoney(transferData);

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing transfer', error: error.message });
  }
};