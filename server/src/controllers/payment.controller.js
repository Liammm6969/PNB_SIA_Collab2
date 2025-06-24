const { StatusCodes } = require('http-status-codes');
const { PaymentService } = require("../services/index.js");
exports.createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const newPayment = await PaymentService.createPayment(paymentData);
    res.status(StatusCodes.CREATED).json(newPayment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
exports.getPayments = async (req, res) => {
  try {
    const payments = await PaymentService.getPaymentsByUser(req.params.userId);
    res.status(StatusCodes.OK).json(payments);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await PaymentService.getPaymentById(paymentId);

    res.status(StatusCodes.OK).json(payment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
exports.transferPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const updatedData = req.body;
    const payment = await PaymentService.updatePayment(paymentId, updatedData);

    res.status(StatusCodes.OK).json(payment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await PaymentService.deletePayment(paymentId);

    res.status(StatusCodes.NO_CONTENT).json(payment);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}



exports.module = {
  createPayment: exports.createPayment,
  getPayments: exports.getPayments,
  getPaymentById: exports.getPaymentById,
  updatePayment: exports.updatePayment,
  deletePayment: exports.deletePayment
};