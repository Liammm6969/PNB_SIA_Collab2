const jsonwebtoken = require("jsonwebtoken");
const config = require("../lib/config.js");
module.exports = jwtManager = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      fullName: user.fullName,
      email: user.email
    },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
