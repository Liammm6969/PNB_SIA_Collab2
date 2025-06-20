const PaymentModel = require('../models/payment.model');
const UserModel = require("../../../user.Microservice/src/models/user.model");
const mongoose = require('mongoose');
class TransferService {
  constructor() {
    this.transferMoney = this.transferMoney.bind(this);
  }

  async transferMoney(transferData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { fromUser, toUser, amount, details } = transferData;

      // Find sender and receiver within the session
      const sender = await UserModel.findById(fromUser).session(session);
      const receiver = await UserModel.findById(toUser).session(session);

      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found');
      }

      // Check for sufficient balance
      if (sender.balance < amount) {
        throw new Error('Insufficient balance');
      }

      sender.balance -= amount;
      receiver.balance += amount;
      await sender.save({ session });
      await receiver.save({ session });
      const payment = new PaymentModel({
        fromUser,
        toUser,
        amount,
        details,
        balanceAfterPayment: sender.balance
      });
      await payment.save({ session });
      await session.commitTransaction();
      return {
        message: 'Transfer successful',
        payment
      };
    } catch (err) {
      await session.abortTransaction();
      return {
        message: 'Transfer failed',
        error: err.message
      };
    } finally {
      session.endSession();
    }
  }
}

module.exports = new TransferService();