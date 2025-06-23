class AppError extends Error {
  constructor(message, { name, statusCode = 500, errorCode, details } = {}) {
    super(message);
    this.name = name || this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
    };
  }
}

module.exports = AppError;
