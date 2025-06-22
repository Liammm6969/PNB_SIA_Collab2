const RouteNotFoundErrorMiddleware = require('./routenotfounderror.middleware');
const ValidateRequestBodyMiddleware = require('./validaterequestbody.middleware');
const ValidateRequestRouteParameterMiddleware = require('./validaterequestrouteparameter.middleware');
const verifyAccessToken = require('./verifyaccesstoken.middleware.js');
const LoginLimiter = require('./loginlimiter.middleware.js');
const PermissionMiddleware = require('./permission.middleware.js');
const ApiLimiterMiddleware = require('./apilimiter.middleware.js');

module.exports = {
  RouteNotFoundErrorMiddleware,
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware,
  verifyAccessToken,
  LoginLimiter,
  PermissionMiddleware,
  ApiLimiterMiddleware
};