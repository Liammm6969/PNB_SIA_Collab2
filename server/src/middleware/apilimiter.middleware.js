const rateLimit = require('express-rate-limit');
const { StatusCodes } = require("http-status-codes")

const apiLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: 'Too many requests, please try again later.'
  }
});

module.exports = apiLimiterMiddleware;
