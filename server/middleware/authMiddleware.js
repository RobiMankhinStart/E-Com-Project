const { verifyToken } = require("../services/helpers");
const { responseHandler } = require("../services/responseHandler");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token["X-AS-Token"]) {
      return responseHandler.error(res, 401, "Invalid Request");
    }
    const decoded = verifyToken(token["X-AS-Token"]);
    if (!decoded) {
      return responseHandler.error(res, 401, "Invalid Request");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return responseHandler.error(res, 401, "Invalid Request");
  }
};

module.exports = authMiddleWare;
