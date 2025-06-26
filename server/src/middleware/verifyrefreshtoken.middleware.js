const jsonwebtoken = require("jsonwebtoken");
const config = require("../lib/config.js");
const { StatusCodes } = require("http-status-codes")

const verifyRefreshToken = (req, res, next) => {

  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh token is required' });
    }

    const jwtPayload = jsonwebtoken.verify(refreshToken, config.JWT_REFRESH_SECRET);
    req.user = {
      userId: jwtPayload.userId,
      firstName: jwtPayload.firstName,
      lastName: jwtPayload.lastName,
      email: jwtPayload.email,
    };
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
  }
};

module.exports = verifyRefreshToken;
