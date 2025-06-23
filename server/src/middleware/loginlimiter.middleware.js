const rateLimit = require('express-rate-limit');
const { StatusCodes } = require("http-status-codes")

const loginLimiterMiddleware = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: 'Too many login attempts, try again in 20 seconds.'
  }
});

module.exports = loginLimiterMiddleware;
