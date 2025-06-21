class TransactionNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TransactionNotFoundError';
  }
}

module.exports = TransactionNotFoundError;
