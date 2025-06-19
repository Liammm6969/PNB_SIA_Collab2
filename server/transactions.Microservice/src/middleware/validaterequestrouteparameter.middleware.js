const ValidateRequestRouteParameterMiddleware = (joiInstance) => {
  return async (req, res, next) => {
    try {
      await joiInstance.validateAsync(req.params);

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = ValidateRequestRouteParameterMiddleware;
