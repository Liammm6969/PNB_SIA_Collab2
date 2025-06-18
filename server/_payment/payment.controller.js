const { SendMoney, TransferMoney } = require('./payment.model');
const { createDocument } = require('../utils/controllerHelper');

// Send Money (B2B, P2P, B2P)
exports.sendMoney = (req, res) => {
  const { senderAccount, senderAccountModel, receiverAccount, receiverAccountModel, amount } = req.body;
  createDocument(SendMoney, {
    senderAccount,
    senderAccountModel,
    receiverAccount,
    receiverAccountModel,
    amount
  }, res);
};

// Transfer Money (B2B, P2P, B2P)
exports.transferMoney = (req, res) => {
  const { fromAccount, fromAccountModel, toAccount, toAccountModel, amount } = req.body;
  createDocument(TransferMoney, {
    fromAccount,
    fromAccountModel,
    toAccount,
    toAccountModel,
    amount
  }, res);
};
