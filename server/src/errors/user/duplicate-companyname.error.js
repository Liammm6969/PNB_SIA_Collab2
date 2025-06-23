const AppError = require('../app.error');
const { StatusCode } = require("http-status-codes")

class DuplicateCompanyNameError extends AppError {
  constructor(details) {
    super('Company name already exists', {
      name: 'DuplicateCompanyNameError',
      statusCode: StatusCode.CONFLICT,
      errorCode: 'DUPLICATE_COMPANY_NAME',
      details,
    });
  }
}

module.exports = DuplicateCompanyNameError;
