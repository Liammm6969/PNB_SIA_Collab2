const jwt = require('jsonwebtoken');
const config = require("../lib/config.js")
const { StatusCodes } = require("http-status-codes")

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token is required' });
    }

    const jwtPayload = jwt.verify(accessToken, config.JWT_SECRET);
    req.user = {
      userId: jwtPayload.userId,
      firstName: jwtPayload.firstName,
      lastName: jwtPayload.lastName,
      email: jwtPayload.email,
    };
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid access token' });
  }

};

module.exports = verifyAccessToken;