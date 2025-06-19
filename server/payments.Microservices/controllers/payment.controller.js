const Payment = require('../models/payment.model');

exports.createPayment = async (req, res) => {}
exports.getPayments= async (req, res) => {}
exports.getPaymentById = async (req, res) => {}
exports.updatePayment = async (req, res) => {}
exports.deletePayment = async (req, res) => {}

exports.module = {
  createPayment: exports.createPayment,
    getPayments: exports.getPayments,
    getPaymentById: exports.getPaymentById,
    updatePayment: exports.updatePayment,
    deletePayment: exports.deletePayment
};