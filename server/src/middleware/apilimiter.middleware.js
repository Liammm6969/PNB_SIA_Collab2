const rateLimit = require('express-rate-limit');
const { StatusCodes } = require("http-status-codes")

const apiLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000, // 60 seconds (1 minute)
  max: 10,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: 'Too many requests, please try again in a minute.'
  }
});

module.exports = apiLimiterMiddleware;
