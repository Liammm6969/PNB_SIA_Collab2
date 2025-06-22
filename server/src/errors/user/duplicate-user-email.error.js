const AppError = require('../app.error');

class DuplicateUserEmailError extends AppError {
  constructor(details) {
    super('User email already exists', {
      name: 'DuplicateUserEmailError',
      statusCode: 409,
      errorCode: 'DUPLICATE_USER_EMAIL',
      details,
    });
  }
}

module.exports = DuplicateUserEmailError;
