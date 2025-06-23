const jsonwebtoken = require("jsonwebtoken");
const config = require("../lib/config.js");


function generateAccessToken(user) {
  return jsonwebtoken.sign(
    {
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken(user) {
  return jsonwebtoken.sign(
    {
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}





module.exports = {
  generateAccessToken,
  generateRefreshToken,
  
};
