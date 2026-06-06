const express = require("express");
const cors = require("cors");

const authRoutes =
require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

module.exports = app;
const verifyToken =
require("./models/authMiddleware");

app.get(
  "/api/test",
  verifyToken,
  (req,res)=>{
     res.json(req.user);
  }
);