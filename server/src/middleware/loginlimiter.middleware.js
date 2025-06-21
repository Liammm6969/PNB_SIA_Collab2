const rateLimit = require('express-rate-limit');

const loginLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    status: 429,
    error: 'Too many login attempts, try again in 15 minutes.'
  }
});
module.exports = loginLimiterMiddleware;