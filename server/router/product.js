const express = require("express");
const {
  createProduct,
  getProductList,
  getProductDetals,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const authMiddleWare = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const multer = require("multer");
const route = express.Router();
const upload = multer();

route.post(
  "/create",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
route.get("/allproducts", getProductList);
route.get("/:slug", getProductDetals);
route.put(
  "/update/:slug",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct,
);
route.delete(
  "/:id",
  authMiddleWare,
  roleCheckMiddleware("admin", "editor"),
  deleteProduct,
);

module.exports = route;
