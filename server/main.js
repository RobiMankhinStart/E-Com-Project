require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var cookieParser = require("cookie-parser");
const dbConfig = require("./dbConfig");
const route = require("./router");
const cloudinaryConfig = require("./services/cloudinaryConfig");
const dns = require("dns");
const { webhook } = require("./controller/order.controller");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://e-com-project-client.vercel.app/",
    credentials: true,
  }),
);

dbConfig();
cloudinaryConfig();
app.post("/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());
app.use(route);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
