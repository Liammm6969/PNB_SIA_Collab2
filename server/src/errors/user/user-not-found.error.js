const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")


class UserNotFoundError extends AppError {
  constructor(details) {
    super('User not found', {
      name: 'UserNotFoundError',
      statusCode: StatusCode.NOT_FOUND,
      errorCode: 'USER_NOT_FOUND',
      details,
    });
  }
}

module.exports = UserNotFoundError;
