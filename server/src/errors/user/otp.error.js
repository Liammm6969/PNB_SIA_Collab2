const AppError = require('../app.error');

class OTPError extends AppError {
  constructor(details) {
    super('OTP error', {
      name: 'OTPError',
      statusCode: 400,
      errorCode: 'OTP_ERROR',
      details,
    });
  }
}

module.exports = OTPError;