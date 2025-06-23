const { StatusCodes } = require("http-status-codes")

const PermissionMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = PermissionMiddleware;


