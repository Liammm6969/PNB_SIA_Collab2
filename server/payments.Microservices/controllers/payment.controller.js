const Payment = require('../models/payment.model');

exports.createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const newPayment = new Payment(paymentData);
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
}
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
}
exports.getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
}
exports.transferPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const updatedData = req.body;
    const payment = await Payment.findByIdAndUpdate(paymentId, updatedData, { new: true });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
}
exports.deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
}



exports.module = {
  createPayment: exports.createPayment,
    getPayments: exports.getPayments,
    getPaymentById: exports.getPaymentById,
    updatePayment: exports.updatePayment,
    deletePayment: exports.deletePayment
};