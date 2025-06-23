const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")


class UserNotFoundError extends AppError {
  constructor(details) {
    super('User not found', {
      name: 'UserNotFoundError',
      statusCode: StatusCodes.NOT_FOUND,
      errorCode: 'USER_NOT_FOUND',
      details,
    });
  }
}

module.exports = UserNotFoundError;
