const AppError = require('../app.error');

class TransactionNotFoundError extends AppError {
  constructor(details) {
    super('Transaction not found', {
      name: 'TransactionNotFoundError',
      statusCode: 404,
      errorCode: 'TRANSACTION_NOT_FOUND',
      details,
    });
  }
}

module.exports = TransactionNotFoundError;
