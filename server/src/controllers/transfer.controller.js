const TransferService = require("../services/transfer.service.js");
const { StatusCodes } = require('http-status-codes');

// Transfer money between users
// POST /api/payments/transfer
// Body: { fromUser, toUser, amount, details }
exports.transferMoney = async (req, res) => {
  try {
    const transferData = req.body;
    const result = await TransferService.transferMoney(transferData);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error processing transfer', error: error.message });
  }
};
0