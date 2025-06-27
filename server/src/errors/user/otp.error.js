const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")

class OTPError extends AppError {
  constructor(details) {
    super('OTP error', {
      name: 'OTPError',
      statusCode: StatusCodes.BAD_REQUEST,
      errorCode: 'OTP_ERROR',
      details,
    });
  }
}

module.exports = OTPError;