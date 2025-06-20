const mongoose = require('mongoose');
const User = require('../../user.Microservice/src/models/user.model');
const Payment = require('../models/payment.model');

// Transfer money between users
// POST /api/payments/transfer
// Body: { fromUser, toUser, amount, details }
exports.transferMoney = async (req, res) => {
  try {
    const { fromUser, toUser, amount, details } = req.body;
    if (!fromUser || !toUser || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer data' });
    }
    // Find sender and receiver
    const sender = await User.findById(fromUser);
    const receiver = await User.findById(toUser);
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    // Perform transfer atomically
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      sender.balance -= amount;
      receiver.balance += amount;
      await sender.save({ session });
      await receiver.save({ session });
      const payment = new Payment({
        fromUser,
        toUser,
        amount,
        details,
        balanceAfterPayment: sender.balance
      });
      await payment.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: 'Transfer successful', payment });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ message: 'Transfer failed', error: err.message });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
};
