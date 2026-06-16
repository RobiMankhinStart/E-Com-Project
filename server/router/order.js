const express = require("express");
const { checkOut, getAllOrders } = require("../controller/order.controller");
const authMiddleWare = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const route = express.Router();

route.post("/checkout", checkOut);
route.get(
  "/all",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  getAllOrders,
);

module.exports = route;
