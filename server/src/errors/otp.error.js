class OTPError extends Error {
  constructor(message ) {
    super(message);
    this.name = 'OTPError';
  }
}

module.exports = OTPError;