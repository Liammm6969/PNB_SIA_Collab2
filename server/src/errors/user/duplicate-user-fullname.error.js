const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class DuplicateUserFullnameError extends AppError {
  constructor(details) {
    super('User fullname already exists', {
      name: 'DuplicateUserFullnameError',
      statusCode: StatusCode.CONFLICT,
      errorCode: 'DUPLICATE_USER_FULLNAME',
      details,
    });
  }
}

module.exports = DuplicateUserFullnameError;