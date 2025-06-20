const RouteNotFoundErrorMiddleware = require('./routenotfounderror.middleware');
const ValidateRequestBodyMiddleware = require('./validaterequestbody.middleware');
const ValidateRequestRouteParameterMiddleware = require('./validaterequestrouteparameter.middleware');
const verifyAccessToken = require('./verifyaccesstoken.middleware');

module.exports = {
  RouteNotFoundErrorMiddleware,
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware,
  verifyAccessToken
};