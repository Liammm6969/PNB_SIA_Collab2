const { Payment, User } = require("../models/index.js");
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
  }  async getPaymentsByUser(userId) {
    try {
      let numericUserId;
      
      // Handle both numeric userIdSeq and full userId string
      if (typeof userId === 'number') {
        numericUserId = userId;
      } else if (typeof userId === 'string') {
        if (userId.includes('-')) {
          // Extract userIdSeq from full userId (e.g., "USER-1000" -> 1000)
          numericUserId = parseInt(userId.split('-')[1]);
        } else {
          // Parse string number
          numericUserId = parseInt(userId);
        }
      } else {
        return []; // Return empty array if invalid format
      }
      
      console.log('Looking for payments with userIdSeq:', numericUserId);
      
      const payments = await Payment.find({
        $or: [
          { fromUser: numericUserId },
          { toUser: numericUserId }
        ]
      }).sort({ createdAt: -1 });
      
      console.log('Found payments:', payments?.length || 0);
      
      return payments || [];
    } catch (err) {
      console.error('Error in getPaymentsByUser:', err);
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