const ValidateRequestRouteParameterMiddleware = (joiInstance) => {
  return async (req, res, next) => {
    try {
      const { error, value } = await joiInstance.validateAsync(req.params);
console.log(value)
      if (error) {
        return next(error);
      }

      req.params = value;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = ValidateRequestRouteParameterMiddleware;
