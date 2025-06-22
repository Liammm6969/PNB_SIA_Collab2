const ValidateRequestRouteParameterMiddleware = (joiInstance) => {
  return async (req, res, next) => {
    try {
      await joiInstance.validateAsync(req.params);

      return next();
    } catch (err) {
      return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
  };
};

module.exports = ValidateRequestRouteParameterMiddleware;
