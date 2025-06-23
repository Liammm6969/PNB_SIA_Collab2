const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class PaymentNotFoundError extends AppError {
  constructor(details) {
    super('Payment not found', {
      name: 'PaymentNotFoundError',
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: 'PAYMENT_NOT_FOUND',
      details,
    });
  }
}

module.exports = PaymentNotFoundError;
