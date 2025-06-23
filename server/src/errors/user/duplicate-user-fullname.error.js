const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class DuplicateUserFullnameError extends AppError {
  constructor(details) {
    super('User fullname already exists', {
      name: 'DuplicateUserFullnameError',
      statusCode: StatusCodes.CONFLICT,
      errorCode: 'DUPLICATE_USER_FULLNAME',
      details,
    });
  }
}

module.exports = DuplicateUserFullnameError;