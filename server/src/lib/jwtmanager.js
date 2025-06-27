const jsonwebtoken = require("jsonwebtoken");
const config = require("../lib/config.js");


function generateAccessToken(user) {
  return jsonwebtoken.sign(
    {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

    },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken(user) {
  return jsonwebtoken.sign(
    {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

function generateStaffAccessToken(staff) {
  return jsonwebtoken.sign(
    {
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email
    },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function generateStaffRefreshToken(staff) {
  return jsonwebtoken.sign(
    {
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}





module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateStaffAccessToken,
  generateStaffRefreshToken

};
