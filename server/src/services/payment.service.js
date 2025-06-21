const PaymentModel= require("../models/index.js");

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
      const payment = new PaymentModel(paymentData);
      await payment.save();
      return payment;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getPaymentsByUser(userId) {
    try {
      const payments = await PaymentModel.find({ userId }).sort({ createdAt: -1 });
      if (!payments) throw new Error('No payments found');
      return payments;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getPaymentById(id) {
    try {
      const payment = await PaymentModel.findById(id);
      if (!payment) throw new Error('Payment not found');
      return payment;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updatePaymentStatus(id, status) {
    try {
      const payment = await PaymentModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!payment) throw new Error('Payment not found');
      return payment;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deletePayment(id) {
    try {
      const payment = await PaymentModel.findByIdAndDelete(id);
      if (!payment) throw new Error('Payment not found');
      return { message: 'Payment deleted' };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = new PaymentService();