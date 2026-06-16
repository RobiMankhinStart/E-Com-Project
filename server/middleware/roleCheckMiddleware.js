const { responseHandler } = require("../services/responseHandler");

const roleCheckMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (roles.includes(req.user.role)) {
        return next();
      }
      return responseHandler.error(res, 403, "Access Denied");
    } catch (error) {
      return responseHandler.error(res, 403, "Access Denied");
    }
  };
};

module.exports = roleCheckMiddleware;
