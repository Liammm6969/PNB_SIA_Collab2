const jwt = require('jsonwebtoken');
const config = require("../lib/config.js")
const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({ message: 'Access token is required' });
    }

    const jwtPayload = jwt.verify(accessToken, config.JWT_SECRET);
    req.user = {
      _id: jwtPayload._id,
      fullName: jwtPayload.fullName,
      email: jwtPayload.email
    };
    req.user = jwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid access token' });
  }

};

module.exports = verifyAccessToken;