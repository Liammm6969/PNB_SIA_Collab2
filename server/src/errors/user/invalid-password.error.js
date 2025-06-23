const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class InvalidPasswordError extends AppError {
  constructor(details) {
    super('Invalid password', {
      name: 'InvalidPasswordError',
      statusCode: StatusCodes.UNAUTHORIZED,
      errorCode: 'INVALID_PASSWORD',
      details,
    });
  }
}

module.exports = InvalidPasswordError;
