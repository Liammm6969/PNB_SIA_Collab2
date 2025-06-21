class PaymentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PaymentNotFoundError';
  }
}

module.exports = PaymentNotFoundError;
