const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class DuplicateStaffEmailError extends AppError {
  constructor(details) {
    super('User email already exists', {
      name: 'DuplicateUserEmailError',
      statusCode: StatusCodes.CONFLICT,
      errorCode: 'DUPLICATE_USER_EMAIL',
      details,
    });
  }
}

module.exports = DuplicateStaffEmailError;
