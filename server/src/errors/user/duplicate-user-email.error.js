const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class DuplicateUserEmailError extends AppError {
  constructor(details) {
    super('User email already exists', {
      name: 'DuplicateUserEmailError',
      statusCode: StatusCode.CONFLICT,
      errorCode: 'DUPLICATE_USER_EMAIL',
      details,
    });
  }
}

module.exports = DuplicateUserEmailError;
