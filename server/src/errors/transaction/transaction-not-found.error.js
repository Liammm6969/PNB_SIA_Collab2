const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class TransactionNotFoundError extends AppError {
  constructor(details) {
    super('Transaction not found', {
      name: 'TransactionNotFoundError',
      statusCode: StatusCode.NOT_FOUND,
      errorCode: 'TRANSACTION_NOT_FOUND',
      details,
    });
  }
}

module.exports = TransactionNotFoundError;
