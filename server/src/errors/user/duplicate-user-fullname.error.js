const AppError = require('../app.error');

class DuplicateUserFullnameError extends AppError {
  constructor(details) {
    super('User fullname already exists', {
      name: 'DuplicateUserFullnameError',
      statusCode: 409,
      errorCode: 'DUPLICATE_USER_FULLNAME',
      details,
    });
  }
}

module.exports = DuplicateUserFullnameError;