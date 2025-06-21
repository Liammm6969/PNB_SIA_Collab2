const ValidateRequestBodyMiddleware = (joiInstance) => {
  return async (req, res, next) => {
    try {
      await joiInstance.validateAsync(req.body);

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = ValidateRequestBodyMiddleware;
