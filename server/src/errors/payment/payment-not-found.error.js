const AppError = require('../app.error');

class PaymentNotFoundError extends AppError {
  constructor(details) {
    super('Payment not found', {
      name: 'PaymentNotFoundError',
      statusCode: 404,
      errorCode: 'PAYMENT_NOT_FOUND',
      details,
    });
  }
}

module.exports = PaymentNotFoundError;
