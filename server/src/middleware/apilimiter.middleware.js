const rateLimit = require('express-rate-limit');

const apiLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

module.exports = apiLimiterMiddleware;
