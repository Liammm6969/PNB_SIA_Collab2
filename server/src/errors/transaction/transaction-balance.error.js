const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")

class TransactionBalanceError extends AppError {
  constructor(details) {
    super('Insufficient balance for transaction', {
      name: 'TransactionBalanceError',
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: 'TRANSACTION_BALANCE_ERROR',
      details,
    });
  }
}

module.exports = TransactionBalanceError;
