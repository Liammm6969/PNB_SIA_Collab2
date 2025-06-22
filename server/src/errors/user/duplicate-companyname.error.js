const AppError = require('../app.error');

class DuplicateCompanyNameError extends AppError {
  constructor(details) {
    super('Company name already exists', {
      name: 'DuplicateCompanyNameError',
      statusCode: 409,
      errorCode: 'DUPLICATE_COMPANY_NAME',
      details,
    });
  }
}

module.exports = DuplicateCompanyNameError;
