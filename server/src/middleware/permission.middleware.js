const { ac } = require('../lib/accesscontrol');

const PermissionMiddleware = (action, resource, getOwnerId = null) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ message: 'Role missing from token' });

    const permissionAny = ac.can(role)[`${action}Any`](resource);
    if (permissionAny.granted) return next();

    if (getOwnerId) {
      const ownerId = getOwnerId(req);
      if (ownerId && ownerId.toString() === req.user.id.toString()) {
        const permissionOwn = ac.can(role)[`${action}Own`](resource);
        if (permissionOwn.granted) return next();
      }
    }

    return res.status(403).json({ message: 'Permission denied' });
  };
};

module.exports = PermissionMiddleware;
