const AppError = require('../app.error');
const { StatusCodes } = require("http-status-codes")

class DuplicateCompanyNameError extends AppError {
  constructor(details) {
    super('Company name already exists', {
      name: 'DuplicateCompanyNameError',
      statusCode: StatusCodes.CONFLICT,
      errorCode: 'DUPLICATE_COMPANY_NAME',
      details,
    });
  }
}

module.exports = DuplicateCompanyNameError;
