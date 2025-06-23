const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class TransactionNotFoundError extends AppError {
  constructor(details) {
    super('Transaction not found', {
      name: 'TransactionNotFoundError',
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: 'TRANSACTION_NOT_FOUND',
      details,
    });
  }
}

module.exports = TransactionNotFoundError;
