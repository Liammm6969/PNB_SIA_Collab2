const AppError = require('../app.error');

class UserNotFoundError extends AppError {
  constructor(details) {
    super('User not found', {
      name: 'UserNotFoundError',
      statusCode: 404,
      errorCode: 'USER_NOT_FOUND',
      details,
    });
  }
}

module.exports = UserNotFoundError;
