const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class PaymentNotFoundError extends AppError {
  constructor(details) {
    super('Payment not found', {
      name: 'PaymentNotFoundError',
      statusCode: StatusCode.NOT_FOUND,
      errorCode: 'PAYMENT_NOT_FOUND',
      details,
    });
  }
}

module.exports = PaymentNotFoundError;
