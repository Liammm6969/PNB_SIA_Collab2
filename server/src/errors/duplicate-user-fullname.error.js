class DuplicateCompanyNameError extends Error {
  constructor(companyName) {
    super(companyName);
    this.name = 'DuplicateCompanyNameError';
  }
}

module.exports = DuplicateCompanyNameError;