const express = require("express");
const {
  createNewCategory,
  getAllCategories,
} = require("../controller/category.controller");
const multer = require("multer");
const authMiddleWare = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const upload = multer();
const route = express.Router();

route.post(
  "/create",
  authMiddleWare,
  roleCheckMiddleware("admin"),
  upload.single("thumbnail"),
  createNewCategory,
);
route.get("/all", getAllCategories);

module.exports = route;
