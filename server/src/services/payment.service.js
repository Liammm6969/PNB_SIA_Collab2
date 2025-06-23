const { Payment } = require("../models/index.js");
const {PaymentNotFoundError} = require("../errors/index.js");
class PaymentService {
  constructor() {
    this.createPayment = this.createPayment.bind(this);
    this.getPaymentsByUser = this.getPaymentsByUser.bind(this);
    this.getPaymentById = this.getPaymentById.bind(this);
    this.updatePaymentStatus = this.updatePaymentStatus.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
  }

  async createPayment(paymentData) {
    try {
      const payment = new Payment(paymentData);
      await payment.save();
      return payment;
    } catch (err) {
      throw err;
    }
  }

  async getPaymentsByUser(userId) {
    try {
      const numericUserId = Number(userId);
      const payments = await Payment.find({
        $or: [
          { fromUser: numericUserId },
          { toUser: numericUserId }
        ]
      }).sort({ createdAt: -1 });
      if (!payments) throw new PaymentNotFoundError('No payments found');
      return payments;
    } catch (err) {
      throw err;
    }
  }

  async getPaymentById(paymentId) {
    try {
      const payment = await Payment.find({ paymentId });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return payment;
    } catch (err) {
      throw err;
    }
  }

  async updatePaymentStatus(paymentId, status) {
    try {
      const payment = await Payment.findOneAndUpdate({ paymentId }, { status }, { new: true });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return payment;
    } catch (err) {
      throw err;
    }
  }

  async deletePayment(paymentId) {
    try {
      const payment = await Payment.findOneAndDelete({ paymentId });
      if (!payment) throw new PaymentNotFoundError('Payment not found');
      return { message: 'Payment deleted' };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new PaymentService();