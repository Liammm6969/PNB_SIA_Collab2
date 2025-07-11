
const { Payment, User } = require("../models/index.js");
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
      console.log(transferData);
      const senderDoc = await User.findOne({userId:fromUser}).session(session);
      const receiverDoc = await User.findOne({userId:toUser}).session(session);
      if (!receiverDoc) throw new Error('Receiver not found');

      if (!senderDoc) throw new Error('Sender not found');

      if (senderDoc.balance < amount) throw new Error('Sender does not have enough balance');

   
        const sender = await User.findOneAndUpdate({
          userId: fromUser,
          balance: { $gte: amount }
        }, {
          $inc: { balance: -amount }
        }, {
          new: true,
          session
        });

        await User.findOneAndUpdate(
          { userId: toUser },
          { $inc: { balance: amount } },
          { new: true, session }
        );


      const payment = new Payment({
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
      return err;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new TransferService();