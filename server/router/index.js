const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const productRouter = require("./product");
const order = require("./order");
const authMiddleWare = require("../middleware/authMiddleware");
const userRouter = require("./user");

route.use("/auth", authRouter);
route.use("/user", userRouter);
route.use("/category", require("./category"));
route.use("/product", productRouter);
route.use("/cart", authMiddleWare, require("./cart"));
route.use("/order", order);

route.get("/", (req, res) => {
  res.send("From Server 8000");
});

module.exports = route;
