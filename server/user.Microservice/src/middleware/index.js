const RouteNotFoundErrorMiddleware = require('./routenotfounderror.middleware');
const ValidateRequestBodyMiddleware = require('./validaterequestbody.middleware');
const ValidateRequestRouteParameterMiddleware = require('./validaterequestrouteparameter.middleware');

module.exports = {
  RouteNotFoundErrorMiddleware,
  ValidateRequestBodyMiddleware,
  ValidateRequestRouteParameterMiddleware
};