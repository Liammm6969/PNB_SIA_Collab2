const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class InvalidPasswordError extends AppError {
  constructor(details) {
    super('Invalid password', {
      name: 'InvalidPasswordError',
      statusCode: StatusCode.UNAUTHORIZED,
      errorCode: 'INVALID_PASSWORD',
      details,
    });
  }
}

module.exports = InvalidPasswordError;
