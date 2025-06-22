const AppError = require('../app.error');

class InvalidPasswordError extends AppError {
  constructor(details) {
    super('Invalid password', {
      name: 'InvalidPasswordError',
      statusCode: 401,
      errorCode: 'INVALID_PASSWORD',
      details,
    });
  }
}

module.exports = InvalidPasswordError;
